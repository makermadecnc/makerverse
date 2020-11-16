import _ from 'lodash';
import path from 'path';
import decimalPlaces from '../../lib/decimal-places';
import settings from '../../config/settings';
import { ConfigStore } from '../../services/configstore';
import {
    MASLOW_ACTIVE_STATE_RUN,
    MASLOW_ACTIVE_STATE_IDLE,
    MASLOW_ACTIVE_STATE_ALARM,
    METRIC_UNITS,
    IMPERIAL_UNITS,
} from './constants';

// GCode which is actually supported by the Maslow Classic
const MaslowClassicGCode = [
    '$', '$$', '!', '~',
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
        wco: {
            x: '0.000',
            y: '0.000',
            z: '0.000'
        },
        buffer: {},
        feedback: {}, // MSG, positional errors, buffer space.
        alarm: null, // Alarm object (from constants)
        error: null, // Error object (from constants)
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
    }
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
        return _.get(state, 'parserstate.modal.units') === 'G21' ? METRIC_UNITS : IMPERIAL_UNITS;
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
        return this.getUnits() === METRIC_UNITS ? val : (val * 25.4);
    }

    fromMM(val) {
        if (typeof val === 'string') {
            val = Number(val);
        }
        return this.getUnits() === METRIC_UNITS ? val : (val / 25.4);
    }

    updateStatus(payload) {
        this.load(); // Ensure disk memory is loaded.
        const hasMPos = _.has(payload, 'mpos');
        const hasWPos = _.has(payload, 'wpos');

        if (this.controller.hardware.isMaslowClassic()) {
            // Do not set the work position on the Maslow Classic. It will be set in-memory.
            if (hasMPos) {
                payload.wpos = {
                    x: Number(payload.mpos.x) - this.fromMM(this.storage.config.status.wco.x),
                    y: Number(payload.mpos.y) - this.fromMM(this.storage.config.status.wco.y),
                    z: Number(payload.mpos.z) - this.fromMM(this.storage.config.status.wco.z)
                };
            }
        } else if (hasMPos && !hasWPos) {
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
        } else if (hasWPos && !hasMPos) {
            payload.mpos = payload.mpos || {};
            _.each(payload.wpos, (wpos, axis) => {
                const digits = decimalPlaces(wpos);
                const wco = _.get((payload.wco || this.storage.config.status.wco), axis, 0);
                payload.mpos[axis] = (Number(wpos) + Number(wco)).toFixed(digits);
            });
        }

        if (hasMPos) {
            if (payload.activeState === MASLOW_ACTIVE_STATE_IDLE && this.lastMachinePosition) {
                // If the Maslow claims it is idle but it has moved since the last status report,
                // then enforce the RUN state.
                const lp = this.lastMachinePosition;
                const mp = payload.mpos;
                const diff = Math.abs(mp.x - lp.x) + Math.abs(mp.y - lp.y) + Math.abs(mp.z - lp.z);
                if (this.toMM(diff) >= 2) {
                    // mininmum movement is large so as to ignore small Maslow calculation changes.
                    payload.activeState = MASLOW_ACTIVE_STATE_RUN;
                }
            }
            this.lastMachinePosition = payload.mpos;
        }

        if (payload.alarm) {
            // If an alarm message was captured and not cleared, enforce the alarm state.
            payload.activeState = MASLOW_ACTIVE_STATE_ALARM;
        }

        // Check if the receive buffer is available in the status report
        // @see https://github.com/cncjs/cncjs/issues/115
        // @see https://github.com/cncjs/cncjs/issues/133
        const rx = Number(_.get(payload, 'buf.rx', 0)) ||
                    Number(_.get(payload, 'feedback.bufferSpaceAvailable', 127)) ||
                    0;
        if (rx > 0) {
            this.controller.adjustBufferSize(rx);
            payload.buffer = { ...this.controller.sender.sp.state };
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
                this.controller.hardware.setGrblValue(name, value ? '1' : '0');
                return line;
            }
        }
        this.controller.hardware.setGrblValue(name, value);
        return line;
    }

    // Generic Gcode command
    handleCommand(cmd) {
        this.log.silly(`MaslowMemory translating command: ${cmd}`);

        if (cmd === '$X') { // Unlock
            this.updateStatus({ error: null });
        }
        if (cmd === '\x18') { // Reset
            this.updateStatus({ alarm: null, activeState: MASLOW_ACTIVE_STATE_IDLE });
        }
        if (!this.controller.hardware.isMaslowClassic()) {
            // Only the Maslow Classic needs in-memory storage.
            return cmd;
        }
        const params = cmd.split(' ');
        const c = params[0];
        const cmds = [cmd];
        const gNum = c[0] === 'G' ? Number(c.substr(1)) : -1;
        if (gNum === 20 || gNum === 21) {
            this.updateModal('units', c);
        } else if (gNum === 90 || gNum === 91) {
            this.updateModal('distance', c);
        } else if (gNum === 10) {
            // Implement "Work Position" for the classic.
            const mpos = this.storage.config.status.mpos;
            const dest = this.extractCoords(params);
            const payload = {};
            Object.keys(dest).forEach((coord) => {
                payload[coord] = this.toMM(Number(mpos[coord]) - dest[coord]);
            });
            this.storage.config.status.wco = { ...this.storage.config.status.wco, ...payload };
            this.save('status.wco', payload);

            // Prevent accidentally changing machine positions:
            cmds[0] = '';
        } else if (c === 'G28.3') {
            params[0] = 'G10'; // Maslow Classic uses WPos to set MPos
            cmds[0] = params.join(' ');
        } else if (gNum === 0 || gNum === 1 || gNum === 2 || gNum === 3) {
            // Adjust absolute movement for the work position when running gcode...
            const absoluteMovement = _.get(this.storage.config, 'parserstate.modal.distance') === 'G90';
            if (absoluteMovement) {
                const dest = this.extractCoords(params);
                const coords = [];
                Object.keys(dest).forEach((coord) => {
                    const origin = this.fromMM(Number(this.storage.config.status.wco[coord]));
                    const v = Math.round((dest[coord] + origin) * 1000) / 1000;
                    coords.push(coord.toUpperCase() + v);
                });
                cmds[0] = `${c}  ${coords.join(' ')}`;
                this.log.debug(`translated machine position ${dest} to work position: ${params}`);
            }
        } else if (cmd === '$H') {
            // "Homing" the classic == reset chain lengths
            cmds[0] = 'B08';
        } else if (cmd === '$X') {
            // When unlocking, just print a welcome message. State was changed above.
            cmds[0] = '$';
        } else if (!MaslowClassicGCode.includes(c) && c[0] !== 'T') {
            this.log.error(`MaslowClassic does not support: ${cmd}`);
        }
        return cmds.join('\n');
    }

    // @params an array like ['X0', 'Y0', 'Z5']
    // @return an object like {x: 0, y: 0, z: 5}
    extractCoords(params) {
        const ret = {};
        for (let i = 0; i < params.length; ++i) {
            if (params[i].startsWith('X')) {
                ret.x = Number(params[i].substr(1));
            } else if (params[i].startsWith('Y')) {
                ret.y = Number(params[i].substr(1));
            } else if (params[i].startsWith('Z')) {
                ret.z = Number(params[i].substr(1));
            }
        }
        return ret;
    }

    // Filter anything that will be written to the serial port, translating the command
    writeFilter(data) {
        this.load(); // Ensure disk memory is loaded.
        const r = data.match(/^(\s*)([^\n^\r]+)(\s*)$/);
        if (!r) {
            return data;
        }
        const prefix = r[1];
        const line = r[2];
        let suffix = r[3];

        if (suffix.includes('\r') && !suffix.includes('\n')) {
            // Carriage return bug fix. The newline *must* be present for some controllers.
            suffix = suffix.replace('\r', '\r\n');
        }

        const translated = this.handleGrblSetting(line) ?? this.handleCommand(line);
        return prefix + translated + suffix;
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
