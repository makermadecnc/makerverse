import _ from 'lodash';
import path from 'path';
import decimalPlaces from '../../lib/decimal-places';
import settings from '../../config/settings';
import { ConfigStore } from '../../services/configstore';
import {
    MASLOW_ACTIVE_STATE_IDLE,
    MASLOW_ACTIVE_STATE_ALARM,
} from './constants';

// GCode which is actually supported by the Maslow Classic
const MaslowClassicGCode = [
    'G0', 'G1', 'G2', 'G3', 'G4', 'G10', 'G20', 'G21', 'G40', 'G38', 'G90', 'G91',
    'M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M30', 'M106', 'M107',
    'B01', 'B02', 'B04', 'B05', 'B06', 'B08', 'B09', 'B10',
    'B11', 'B13', 'B14', 'B15', 'B16', 'B17', 'B18', 'B19', 'B20', 'B99',
];

// Default values for the MaslowMemory.
const stateDefaults = {
    status: {
        activeState: '',
        mpos: {
            x: '0.000',
            y: '0.000',
            z: '0.000'
        },
        wpos: {
            x: '0.000',
            y: '0.000',
            z: '0.000'
        },
        err: {},
        ov: []
    },
    parserstate: {
        modal: {
            motion: 'G0', // G0, G1, G2, G3, G38.2, G38.3, G38.4, G38.5, G80
            wcs: 'G54', // G54, G55, G56, G57, G58, G59
            plane: 'G17', // G17: xy-plane, G18: xz-plane, G19: yz-plane
            units: 'G21', // G20: Inches, G21: Millimeters
            distance: 'G90', // G90: Absolute, G91: Relative
            feedrate: 'G94', // G93: Inverse time mode, G94: Units per minute
            program: 'M0', // M0, M1, M2, M30
            spindle: 'M5', // M3: Spindle (cw), M4: Spindle (ccw), M5: Spindle off
            coolant: 'M9' // M7: Mist coolant, M8: Flood coolant, M9: Coolant off, [M7,M8]: Both on
        },
        tool: '',
        feedrate: '',
        spindle: ''
    },
    workOrigin: {
        x: 0,
        y: 0,
        z: 0
    },
};

/**
 * The Maslow classic expects the software layer to handle settings which it cannot due to
 * limited memory / system capabilities. This translation layer serves as the memory which the
 * hardware lacks.
 */
class MaslowMemory {
    storage = new ConfigStore(false);

    loaded = false;

    constructor(controller) {
        this.controller = controller;
        this.log = controller.log;
        // Just in case the config is accessed early...
        this.storage.config = stateDefaults;
    }

    getMachinePosition(state = this.storage.config) {
        return _.get(state, 'status.mpos', {});
    }

    getWorkPosition(state = this.storage.config) {
        return _.get(state, 'status.wpos', {});
    }

    getModalGroup(state = this.storage.config) {
        return _.get(state, 'parserstate.modal', {});
    }

    getTool(state = this.storage.config) {
        return Number(_.get(state, 'parserstate.tool')) || 0;
    }

    getUnits(state = this.storage.config) {
        return _.get(state, 'parserstate.modal.units') === 'G21' ? 'mm' : 'in';
    }

    isAlarm() {
        const activeState = _.get(this.storage.config, 'status.activeState');
        return activeState === MASLOW_ACTIVE_STATE_ALARM;
    }

    isIdle() {
        const activeState = _.get(this.storage.config, 'status.activeState');
        return activeState === MASLOW_ACTIVE_STATE_IDLE;
    }

    updateParserState(payload) {
        this.load(); // Ensure disk memory is loaded.
        const { modal, tool, feedrate, spindle } = payload;
        this.save('parserstate', {
            modal: modal,
            tool: tool,
            feedrate: feedrate,
            spindle: spindle
        });
    }

    updateModal(name, value) {
        this.load(); // Ensure disk memory is loaded.
        this.save('parserstate', { 'modal': { [name]: value } });
    }

    toMM(val) {
        return this.getUnits() === 'mm' ? val : (val * 25.4);
    }

    fromMM(val) {
        return this.getUnits() === 'mm' ? val : (val / 25.4);
    }

    updateStatus(payload) {
        this.load(); // Ensure disk memory is loaded.
        if (this.controller.hardware.isMaslowClassic()) {
            // Do not set the work position on the Maslow Classic. It will be set in-memory.
            if (_.has(payload, 'mpos')) {
                payload.wpos = {
                    x: Number(payload.mpos.x) - this.fromMM(this.storage.config.workOrigin.x),
                    y: Number(payload.mpos.y) - this.fromMM(this.storage.config.workOrigin.y),
                    z: Number(payload.mpos.z) - this.fromMM(this.storage.config.workOrigin.z)
                };
            }
        } else if (_.has(payload, 'mpos') && !_.has(payload, 'wpos')) {
            // Grbl v1.1
            // WCO:0.000,10.000,2.500
            // A current work coordinate offset is now sent to easily convert
            // between position vectors, where WPos = MPos - WCO for each axis.
            payload.wpos = payload.wpos || {};
            _.each(payload.mpos, (mpos, axis) => {
                const digits = decimalPlaces(mpos);
                const wco = _.get((payload.wco || this.storage.config.status.wco), axis, 0);
                payload.wpos[axis] = (Number(mpos) - Number(wco)).toFixed(digits);
            });
        } else if (_.has(payload, 'wpos') && !_.has(payload, 'mpos')) {
            payload.mpos = payload.mpos || {};
            _.each(payload.wpos, (wpos, axis) => {
                const digits = decimalPlaces(wpos);
                const wco = _.get((payload.wco || this.storage.config.status.wco), axis, 0);
                payload.mpos[axis] = (Number(wpos) + Number(wco)).toFixed(digits);
            });
        }

        this.save('status', payload);
    }

    // Grbl settings: $0-$255
    // [name]=[value] handler
    handleGrblSetting(line) {
        const r = line.match(/^(\$\d{1,3})=([\d\.]+)$/);
        if (!r) {
            return null;
        }
        const name = r[1];
        const value = Number(r[2]);
        this.log.debug(`MaslowMemory translating Grbl setting: ${name}=${value}`);
        if (!this.controller.hardware.isMaslowClassic()) {
            if ((name === '$13') && (value >= 0) && (value <= 65535)) {
                this.controller.hardware.setGrbl(name, value ? '1' : '0');
            }
        }
        return line + '\n';
    }

    // Generic Gcode command
    handleCommand(cmd) {
        this.log.silly(`MaslowMemory translating command: ${cmd}`);
        if (!this.controller.hardware.isMaslowClassic()) {
            // Only the Maslow Classic needs in-memory storage.
            return cmd + '\n';
        }
        const params = cmd.split(' ');
        const c = params[0];
        const cmds = [cmd];
        if (c === 'G20' || c === 'G21') {
            this.updateModal('units', c);
        } else if (c === 'G90' || c === 'G91') {
            this.updateModal('distance', c);
        } else if (c === 'G10') {
            // Implement "Work Position" for the classic.
            const mpos = this.storage.config.status.mpos;
            const payload = {};
            for (let i = 1; i < params.length; ++i) {
                if (params[i].indexOf('X') === 0) {
                    payload.x = this.toMM(Number(mpos.x) - Number(params[i].substr(1)));
                } else if (params[i].indexOf('Y') === 0) {
                    payload.y = this.toMM(Number(mpos.y) - Number(params[i].substr(1)));
                } else if (params[i].indexOf('Z') === 0) {
                    payload.z = this.toMM(Number(mpos.z) - Number(params[i].substr(1)));
                }
            }
            this.storage.config.workOrigin = { ...this.storage.config.workOrigin, ...payload };
            this.save('workOrigin', payload);
        } else if (c === 'G0') {
            // Adjust absolute movement for the work position
            if (_.get(this.storage.config, 'parserstate.modal.distance') === 'G90') {
                for (let i = 1; i < params.length; ++i) {
                    if (params[i].indexOf('X') === 0) {
                        params[i] = 'X' + (Number(params[i].substr(1)) + this.fromMM(Number(this.storage.config.workOrigin.x)));
                    } else if (params[i].indexOf('Y') === 0) {
                        params[i] = 'Y' + (Number(params[i].substr(1)) + this.fromMM(Number(this.storage.config.workOrigin.y)));
                    }
                }
                cmds[0] = params.join(' ');
                this.log.silly(`translated G91 absolute position for work position: ${params}`);
            }
        } else if (cmd === '$H') {
            // "Homing" the classic == reset chain lengths
            cmds[0] = 'B08';
        } else if (!MaslowClassicGCode.includes(c) && c[0] !== 'T' && c[0] !== '$') {
            this.log.error(`MaslowClassic does not support: ${cmd}`);
        }
        /*if (cmd === '$X') { }*/
        return cmds.join('\n') + '\n';
    }

    // Filter anything that will be written to the serial port, translating the command
    writeFilter(data) {
        this.load(); // Ensure disk memory is loaded.
        const line = data.trim();

        if (!line) {
            return data;
        }

        return this.handleGrblSetting(line) ?? this.handleCommand(line);
    }

    // Load Maslow Classic pseudo-memory from disk
    load() {
        if (!this.controller.hardware.isMaslowClassic() || this.loaded) {
            return;
        }
        const filename = `${this.controller.options.id}.json`;
        const filepath = path.resolve(settings.home, filename);
        try {
            this.storage.load(filepath, this.storage.config);
            this.log.debug(`Loaded state from ${filepath}`);
        } catch (e) {
            this.log.warn(`using default configuration because: ${e}`);
        }
        this.loaded = true;
    }

    // Save Maslow Classic pseudo-memory to disk
    save(key, payload) {
        this.load();
        _.update(this.storage.config, key, (val) => {
            this.controller.log.silly(`${key} = ${JSON.stringify(val)} + ${JSON.stringify(payload)}`);
            return _.merge(val || {}, payload);
        });
        // Do not write to disk for status changes; they happen too frequently, and are
        // actually computed values anyways.
        if (this.controller.hardware.isMaslowClassic() && key !== 'status') {
            try {
                this.storage.sync();
            } catch (e) {
                this.log.error(`failed to save state: ${e}`);
            }
        }
    }
}

export default MaslowMemory;
