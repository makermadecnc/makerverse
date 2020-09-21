import _ from 'lodash';
import {
    IMPERIAL_UNITS,
    METRIC_UNITS,
    GRBL,
    MASLOW,
    MARLIN,
    TINYG,
    CONTROLLERS,
    ACTIVE_STATE_IDLE,
    ACTIVE_STATE_RUN,
    ACTIVE_STATE_HOLD,
    ACTIVE_STATE_DOOR,
    ACTIVE_STATE_HOME,
    ACTIVE_STATE_SLEEP,
    ACTIVE_STATE_ALARM,
    ACTIVE_STATE_CHECK,
} from 'app/constants';

const DEFAULT = '';

const DEFAULT_STATES = [
    ACTIVE_STATE_IDLE,
    ACTIVE_STATE_RUN,
    ACTIVE_STATE_HOLD,
    ACTIVE_STATE_DOOR,
    ACTIVE_STATE_HOME,
    ACTIVE_STATE_SLEEP,
    ACTIVE_STATE_ALARM,
    ACTIVE_STATE_CHECK,
];

// TinyG Machine State
// https://github.com/synthetos/g2/wiki/Status-Reports#stat-values
export const TINYG_MACHINE_STATE_INITIALIZING = 0; // Machine is initializing
export const TINYG_MACHINE_STATE_READY = 1; // Machine is ready for use
export const TINYG_MACHINE_STATE_ALARM = 2; // Machine is in alarm state
export const TINYG_MACHINE_STATE_STOP = 3; // Machine has encountered program stop
export const TINYG_MACHINE_STATE_END = 4; // Machine has encountered program end
export const TINYG_MACHINE_STATE_RUN = 5; // Machine is running
export const TINYG_MACHINE_STATE_HOLD = 6; // Machine is holding
export const TINYG_MACHINE_STATE_PROBE = 7; // Machine is in probing operation
export const TINYG_MACHINE_STATE_CYCLE = 8; // Reserved for canned cycles (not used)
export const TINYG_MACHINE_STATE_HOMING = 9; // Machine is in a homing cycle
export const TINYG_MACHINE_STATE_JOG = 10; // Machine is in a jogging cycle
export const TINYG_MACHINE_STATE_INTERLOCK = 11; // Machine is in safety interlock hold
export const TINYG_MACHINE_STATE_SHUTDOWN = 12; // Machine is in shutdown state. Will not process commands
export const TINYG_MACHINE_STATE_PANIC = 13; // Machine is in panic state. Needs to be physically reset

const TINYG_STATES = [
    TINYG_MACHINE_STATE_INITIALIZING,
    TINYG_MACHINE_STATE_READY,
    TINYG_MACHINE_STATE_ALARM,
    TINYG_MACHINE_STATE_STOP,
    TINYG_MACHINE_STATE_END,
    TINYG_MACHINE_STATE_RUN,
    TINYG_MACHINE_STATE_HOLD,
    TINYG_MACHINE_STATE_PROBE,
    TINYG_MACHINE_STATE_CYCLE,
    TINYG_MACHINE_STATE_HOMING,
    TINYG_MACHINE_STATE_JOG,
    TINYG_MACHINE_STATE_INTERLOCK,
    TINYG_MACHINE_STATE_SHUTDOWN,
    TINYG_MACHINE_STATE_PANIC,
];

/**
 * ActiveState normalizes the current status of a machine across protocols.
 * - isImperialUnits for checking current units.
 * - mpos & wpos (in reported units)
 * - isIdle, isRunning, hasAlarm, etc.
 */
class ActiveState {
    constructor(controllerType, controllerState = {}) {
        this._controllerType = controllerType;
        this.updateControllerState(controllerState);
    }

    updateControllerState(controllerState) {
        if (typeof controllerState !== 'object') {
            return;
        }
        this._state = _.get(controllerState, this.controllerStateKey);
        this._modal = _.get(controllerState, this.modalStateKey) || {};
        this._mpos = _.get(controllerState, this.mposKey);
        this._wpos = _.get(controllerState, this.wposKey);
        if (_.has(controllerState, 'status')) {
            const status = controllerState.status;
            this.error = status.error;
            this.alarm = status.alarm;
        } else {
            this.error = null;
            this.alarm = null;
        }
    }

    get modalStateKey() {
        if (this._controllerType === TINYG) {
            return 'sr.modal';
        }
        if (this._controllerType === MARLIN) {
            return 'modal';
        }
        return 'parserstate.modal';
    }

    get mposKey() {
        if (this._controllerType === TINYG) {
            return 'sr.mpos';
        }
        if (this._controllerType === MARLIN) {
            return 'pos'; // same as machine pos.
        }
        return 'status.mpos';
    }

    get wposKey() {
        if (this._controllerType === TINYG) {
            return 'sr.wpos';
        }
        if (this._controllerType === MARLIN) {
            return 'pos';
        }
        return 'status.wpos';
    }

    get controllerStateKey() {
        if (this._controllerType === TINYG) {
            return 'sr.machineState';
        }
        return 'status.activeState';
    }

    get mpos() {
        return this._mpos;
    }

    get wpos() {
        return this._wpos;
    }

    get stateValue() {
        return this._state;
    }

    get units() {
        return this.isImperialUnits ? IMPERIAL_UNITS : METRIC_UNITS;
    }

    get isImperialUnits() {
        return this.modal.units === 'G20';
    }

    // State normalized into one of the ACTIVE_STATE_* values
    get stateKey() {
        if (this.isIdle) {
            return ACTIVE_STATE_IDLE;
        } else if (this.isRunning) {
            return ACTIVE_STATE_RUN;
        } else if (this.isPaused) {
            return ACTIVE_STATE_HOLD;
        } else if (this.isHoming) {
            return ACTIVE_STATE_HOME;
        } else if (this.hasAlarm) {
            return ACTIVE_STATE_ALARM;
        } else if (this.isSleeping) {
            return ACTIVE_STATE_SLEEP;
        } else {
            // eh, oh well.
            return `${this.stateValue}`.toLowerCase();
        }
    }

    get modal() {
        return this._modal;
    }

    get stateStyle() {
        switch (this.stateKey) {
        case ACTIVE_STATE_IDLE: return 'controller-state-default';
        case ACTIVE_STATE_RUN: return 'controller-state-primary';
        case ACTIVE_STATE_HOLD: return 'controller-state-warning';
        case ACTIVE_STATE_DOOR: return 'controller-state-warning';
        case ACTIVE_STATE_HOME: return 'controller-state-primary';
        case ACTIVE_STATE_SLEEP: return 'controller-state-success';
        case ACTIVE_STATE_ALARM: return 'controller-state-danger';
        case ACTIVE_STATE_CHECK: return 'controller-state-info';
        default: return 'controller-state-info';
        }
    }

    get isValid() {
        return CONTROLLERS.includes(this._controllerType) && this.isValidState;
    }

    get isValidState() {
        return this._controllerType === MARLIN || this.validStates.includes(this.stateValue);
    }

    get validStates() {
        return this._controllerType === TINYG ? TINYG_STATES : DEFAULT_STATES;
    }

    get isIdle() {
        return this._stateCheck({
            [TINYG]: TINYG_MACHINE_STATE_READY,
            [DEFAULT]: ACTIVE_STATE_IDLE,
        });
    }

    get isSleeping() {
        return this._stateCheck({
            [DEFAULT]: ACTIVE_STATE_SLEEP,
        });
    }

    get isRunning() {
        return this._stateCheck({
            [TINYG]: TINYG_MACHINE_STATE_RUN,
            [DEFAULT]: ACTIVE_STATE_RUN,
        });
    }

    get isPaused() {
        return this._stateCheck({
            [TINYG]: TINYG_MACHINE_STATE_HOLD,
            [DEFAULT]: ACTIVE_STATE_HOLD,
        });
    }

    get isHoming() {
        return this._stateCheck({
            [TINYG]: TINYG_MACHINE_STATE_HOMING,
            [DEFAULT]: ACTIVE_STATE_HOME,
        });
    }

    get hasAlarm() {
        return this._stateCheck({
            [TINYG]: TINYG_MACHINE_STATE_ALARM,
            [DEFAULT]: ACTIVE_STATE_ALARM,
        });
    }

    get isAtEnd() {
        return this._controllerType === TINYG && this.stateValue === TINYG_MACHINE_STATE_END;
    }

    get isStopped() {
        return this._controllerType === TINYG && this.stateValue === TINYG_MACHINE_STATE_STOP;
    }

    // Valid & Idle (or presumed to be idle, if no status known)
    get isReady() {
        return this.isValid && (this._controllerType === MARLIN || this.isIdle);
    }

    get canMove() {
        if (this._controllerType === TINYG) {
            const states = [
                TINYG_MACHINE_STATE_STOP,
                TINYG_MACHINE_STATE_END,
            ];
            if (states.includes(this.stateValue)) {
                return true;
            }
        }
        return this.isReady || this.isRunning || this.isAtEnd || this.isStopped;
    }

    get canShuttle() {
        return this.canMove;
    }

    get canProbe() {
        if (![GRBL, MASLOW, MARLIN].includes(this._controllerType)) {
            return false;
        }
        return this.isReady;
    }

    get canRunMacro() {
        if (![GRBL, MASLOW, MARLIN].includes(this._controllerType)) {
            return false;
        }
        return this.isReady || this.isRunning;
    }

    get canAdjustSpindle() {
        if (![GRBL, MASLOW, MARLIN].includes(this._controllerType)) {
            return false;
        }
        return this.isReady || this.isPaused;
    }

    get isAgitated() {
        if (this._controllerType === MARLIN) {
            return false;
        }
        return this.isRunning;
    }

    _stateCheck(controllerTypeMap) {
        return this.stateValue === (controllerTypeMap[this._controllerType] || controllerTypeMap[DEFAULT]);
    }
}

export default ActiveState;
