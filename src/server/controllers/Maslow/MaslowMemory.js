import _ from 'lodash';
import decimalPlaces from '../../lib/decimal-places';
import logger from '../../lib/logger';
import {
    MASLOW_ACTIVE_STATE_IDLE,
    MASLOW_ACTIVE_STATE_ALARM,
} from './constants';

const log = logger('controller:MaslowMemory');

// GCode which is actually supported by the Maslow Classic
const MaslowClassicGCode = [
    'G0', 'G1', 'G2', 'G3', 'G4', 'G10', 'G20', 'G21', 'G40', 'G38', 'G90', 'G91'
];
/**
 * The Maslow classic expects the software layer to handle settings which it cannot due to
 * limited memory / system capabilities. This translation layer serves as the memory which the
 * hardware lacks.
 */
class MaslowMemory {
    state = {
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

    workOrigin = {
        x: 0,
        y: 0,
        z: 0
    };

    constructor(runner) {
        this.runner = runner;
    }

    getMachinePosition(state = this.state) {
        return _.get(state, 'status.mpos', {});
    }

    getWorkPosition(state = this.state) {
        return _.get(state, 'status.wpos', {});
    }

    getModalGroup(state = this.state) {
        return _.get(state, 'parserstate.modal', {});
    }

    getTool(state = this.state) {
        return Number(_.get(state, 'parserstate.tool')) || 0;
    }

    isAlarm() {
        const activeState = _.get(this.state, 'status.activeState');
        return activeState === MASLOW_ACTIVE_STATE_ALARM;
    }

    isIdle() {
        const activeState = _.get(this.state, 'status.activeState');
        return activeState === MASLOW_ACTIVE_STATE_IDLE;
    }

    updateParserState(payload) {
        const { modal, tool, feedrate, spindle } = payload;
        const nextState = {
            ...this.state,
            parserstate: {
                modal: modal,
                tool: tool,
                feedrate: feedrate,
                spindle: spindle
            }
        };
        if (!_.isEqual(this.state.parserstate, nextState.parserstate)) {
            this.state = nextState; // enforce change
        }
        this.runner.emit('parserstate', payload);
    }

    updateModal(name, value) {
        this.state.parserstate.modal[name] = value;
        this.runner.emit('parserstate', this.state.parserstate);
    }

    updateStatus(payload) {
        if (this.runner.isMaslowClassic()) {
            // Do not set the work position on the Maslow Classic. It will be set in-memory.
            if (_.has(payload, 'mpos')) {
                payload.wpos = {
                    x: Number(payload.mpos.x) - this.workOrigin.x,
                    y: Number(payload.mpos.y) - this.workOrigin.y,
                    z: Number(payload.mpos.z) - this.workOrigin.z
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
                const wco = _.get((payload.wco || this.state.status.wco), axis, 0);
                payload.wpos[axis] = (Number(mpos) - Number(wco)).toFixed(digits);
            });
        } else if (_.has(payload, 'wpos') && !_.has(payload, 'mpos')) {
            payload.mpos = payload.mpos || {};
            _.each(payload.wpos, (wpos, axis) => {
                const digits = decimalPlaces(wpos);
                const wco = _.get((payload.wco || this.state.status.wco), axis, 0);
                payload.mpos[axis] = (Number(wpos) + Number(wco)).toFixed(digits);
            });
        }

        const nextState = {
            ...this.state,
            status: {
                ...this.state.status,
                ...payload
            }
        };

        // Delete the raw key
        delete nextState.status.raw;

        if (!_.isEqual(this.state.status, nextState.status)) {
            this.state = nextState; // enforce change
        }

        this.runner.emit('status', payload);
    }

    // [name]=[value] handler
    handleGrblSetting(name, value) {
        log.debug(`MaslowMemory translating Grbl setting: ${name}=${value}`);
        if (!this.runner.isMaslowClassic()) {
            if ((name === '$13') && (value >= 0) && (value <= 65535)) {
                const nextSettings = {
                    ...this.runner.settings,
                    settings: {
                        ...this.runner.settings.settings,
                        [name]: value ? '1' : '0'
                    }
                };
                this.runner.settings = nextSettings; // enforce change
            }
            return true;
        }
        return true;
    }

    // Generic Gcode command
    handleCommand(cmd) {
        log.debug(`MaslowMemory translating command: ${cmd}`);
        if (!this.runner.isMaslowClassic()) {
            // Only the Maslow Classic needs in-memory storage.
            return cmd;
        }
        const cmds = cmd.split(' ');
        const c = cmds[0];
        if (c === 'G20' || c === 'G21') {
            this.updateModal('units', c);
        } else if (c === 'G90' || c === 'G91') {
            this.updateModal('distance', c);
        } else if (c === 'G10') {
            // Implement "Work Position" for the classic.
            const mpos = this.state.status.mpos;
            for (let i = 1; i < cmds.length; ++i) {
                if (cmds[i].indexOf('X') === 0) {
                    this.workOrigin.x = Number(cmds[i].substr(1)) + Number(mpos.x);
                } else if (cmds[i].indexOf('Y') === 0) {
                    this.workOrigin.y = Number(cmds[i].substr(1)) + Number(mpos.y);
                } else if (cmds[i].indexOf('Z') === 0) {
                    this.workOrigin.z = Number(cmds[i].substr(1)) + Number(mpos.z);
                }
            }
        } else if (c === 'G0') {
            // Adjust absolute movement for the work position
            if (_.get(this.state, 'parserstate.modal.distance') === 'G90') {
                for (let i = 1; i < cmds.length; ++i) {
                    if (cmds[i].indexOf('X') === 0) {
                        cmds[i] = 'X' + (Number(cmds[i].substr(1)) + Number(this.workOrigin.x));
                    } else if (cmds[i].indexOf('Y') === 0) {
                        cmds[i] = 'Y' + (Number(cmds[i].substr(1)) + Number(this.workOrigin.y));
                    }
                }
                log.silly(`translated G91 absolute position for work position: ${cmds}`);
            }
        } else if (cmd === '$H') {
            // "Homing" the classic == reset chain lengths
            cmds[0] = 'B08';
        } else if (!MaslowClassicGCode.includes(c)) {
            log.error(`MaslowClassic does not support: ${cmd}`);
            return cmd;
        }
        /*if (cmd === '$X') { }*/
        return cmds.join(' ') + '\n';
    }

    // Filter anything that will be written to the serial port, translating the command
    writeFilter(data) {
        const line = data.trim();

        if (!line) {
            return data;
        }

        // Grbl settings: $0-$255
        const r = line.match(/^(\$\d{1,3})=([\d\.]+)$/);
        return r ? this.handleGrblSetting(r[1], Number(r[2])) : this.handleCommand(line);
    }
}

export default MaslowMemory;
