import { MachineControllerType } from '@openworkshop/lib/api/graphql';
import {
  ACTIVE_STATE_ALARM,
  ACTIVE_STATE_CHECK,
  ACTIVE_STATE_DOOR,
  ACTIVE_STATE_HOLD,
  ACTIVE_STATE_HOME,
  ACTIVE_STATE_IDLE,
  ACTIVE_STATE_RUN,
  ACTIVE_STATE_SLEEP,
  CONTROLLERS,
  IMPERIAL_UNITS,
  METRIC_UNITS,
} from 'constants/index';
import _ from 'lodash';

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

export interface IPos {
  x: number;
  y: number;
  z: number;
}

interface IModal {
  units: string;
}

interface IAlert {
  message: string;
  description: string;
}

interface IStatus {
  alarm?: IAlert;
  error?: IAlert;
}

type MachineState = string | number;

/**
 * ActiveState normalizes the current status of a machine across protocols.
 * - isImperialUnits for checking current units.
 * - mpos & wpos (in reported units)
 * - isIdle, isRunning, hasAlarm, etc.
 */
class ActiveState {
  _controllerType: MachineControllerType;

  constructor(controllerType: MachineControllerType, controllerState = {}) {
    this._controllerType = controllerType;
    this.updateControllerState(controllerState);
  }

  _state?: string;
  _mpos?: IPos;
  _wpos?: IPos;
  _modal?: IModal;
  error?: IAlert;
  alarm?: IAlert;

  updateControllerState(controllerState: { [key: string]: unknown }): void {
    if (typeof controllerState !== 'object') {
      return;
    }
    this._state = _.get(controllerState, this.controllerStateKey) as string;
    this._modal = _.get(controllerState, this.modalStateKey) as IModal;
    this._mpos = _.get(controllerState, this.mposKey) as IPos;
    this._wpos = _.get(controllerState, this.wposKey) as IPos;
    const status: IStatus | undefined = _.get(controllerState, 'status') as IStatus;
    if (status) {
      this.error = status.error;
      this.alarm = status.alarm;
    } else {
      this.error = undefined;
      this.alarm = undefined;
    }
  }

  get modalStateKey(): string {
    if (this._controllerType === MachineControllerType.TinyG) {
      return 'sr.modal';
    }
    if (this._controllerType === MachineControllerType.Marlin) {
      return 'modal';
    }
    return 'parserstate.modal';
  }

  get mposKey(): string {
    if (this._controllerType === MachineControllerType.TinyG) {
      return 'sr.mpos';
    }
    if (this._controllerType === MachineControllerType.Marlin) {
      return 'pos'; // same as machine pos.
    }
    return 'status.mpos';
  }

  get wposKey(): string {
    if (this._controllerType === MachineControllerType.TinyG) {
      return 'sr.wpos';
    }
    if (this._controllerType === MachineControllerType.Marlin) {
      return 'pos';
    }
    return 'status.wpos';
  }

  get controllerStateKey(): string {
    if (this._controllerType === MachineControllerType.TinyG) {
      return 'sr.machineState';
    }
    return 'status.activeState';
  }

  get mpos(): IPos | undefined {
    return this._mpos;
  }

  get wpos(): IPos | undefined {
    return this._wpos;
  }

  get stateValue(): MachineState | undefined {
    return this._state;
  }

  get units(): string {
    return this.isImperialUnits ? IMPERIAL_UNITS : METRIC_UNITS;
  }

  get isImperialUnits(): boolean {
    return this.modal?.units === 'G20';
  }

  // State normalized into one of the ACTIVE_STATE_* values
  get stateKey(): string | undefined {
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
    } else if (this.stateValue) {
      // eh, oh well.
      return `${this.stateValue}`.toLowerCase();
    } else {
      return undefined;
    }
  }

  get modal(): IModal | undefined {
    return this._modal;
  }

  get stateStyle(): string {
    const sk = this.stateKey;
    if (sk === ACTIVE_STATE_IDLE)
      return 'controller-state-default';
    if (sk === ACTIVE_STATE_RUN)
      return 'controller-state-primary';
    if (sk === ACTIVE_STATE_HOLD)
      return 'controller-state-warning';
    if (sk === ACTIVE_STATE_DOOR)
      return 'controller-state-warning';
    if (sk === ACTIVE_STATE_HOME)
      return 'controller-state-primary';
    if (sk === ACTIVE_STATE_SLEEP)
      return 'controller-state-success';
    if (sk === ACTIVE_STATE_ALARM)
      return 'controller-state-danger';
    if (sk ===  ACTIVE_STATE_CHECK)
      return 'controller-state-info';
    return 'controller-state-info';
  }

  get isValid(): boolean {
    return CONTROLLERS.includes(this._controllerType) && this.isValidState;
  }

  get isValidState(): boolean {
    return (
      this._controllerType === MachineControllerType.Marlin ||
      (!!this.stateValue && this.validStates.includes(this.stateValue))
    );
  }

  get validStates(): MachineState[] {
    return this._controllerType === MachineControllerType.TinyG ? TINYG_STATES : DEFAULT_STATES;
  }

  get isIdle(): boolean {
    return this._stateCheck({
      [MachineControllerType.TinyG]: TINYG_MACHINE_STATE_READY,
      [DEFAULT]: ACTIVE_STATE_IDLE,
    });
  }

  get isSleeping(): boolean {
    return this._stateCheck({
      [DEFAULT]: ACTIVE_STATE_SLEEP,
    });
  }

  get isRunning(): boolean {
    return this._stateCheck({
      [MachineControllerType.TinyG]: TINYG_MACHINE_STATE_RUN,
      [DEFAULT]: ACTIVE_STATE_RUN,
    });
  }

  get isPaused(): boolean {
    return this._stateCheck({
      [MachineControllerType.TinyG]: TINYG_MACHINE_STATE_HOLD,
      [DEFAULT]: ACTIVE_STATE_HOLD,
    });
  }

  get isHoming(): boolean {
    return this._stateCheck({
      [MachineControllerType.TinyG]: TINYG_MACHINE_STATE_HOMING,
      [DEFAULT]: ACTIVE_STATE_HOME,
    });
  }

  get hasAlarm(): boolean {
    return this._stateCheck({
      [MachineControllerType.TinyG]: TINYG_MACHINE_STATE_ALARM,
      [DEFAULT]: ACTIVE_STATE_ALARM,
    });
  }

  get isAtEnd(): boolean {
    return this._controllerType === MachineControllerType.TinyG && this.stateValue === TINYG_MACHINE_STATE_END;
  }

  get isStopped(): boolean {
    return this._controllerType === MachineControllerType.TinyG && this.stateValue === TINYG_MACHINE_STATE_STOP;
  }

  // Valid & Idle (or presumed to be idle, if no status known)
  get isReady(): boolean {
    return this.isValid && (this._controllerType === MachineControllerType.Marlin || this.isIdle);
  }

  get canMove(): boolean {
    if (this._controllerType === MachineControllerType.TinyG) {
      const states: MachineState[] = [TINYG_MACHINE_STATE_STOP, TINYG_MACHINE_STATE_END];
      if (this.stateValue && states.includes(this.stateValue)) {
        return true;
      }
    }
    return this.isReady || this.isRunning || this.isAtEnd || this.isStopped;
  }

  get canShuttle(): boolean {
    return this.canMove;
  }

  get canProbe(): boolean {
    if (
      ![MachineControllerType.Grbl, MachineControllerType.Maslow, MachineControllerType.Marlin].includes(
        this._controllerType,
      )
    ) {
      return false;
    }
    return this.isReady;
  }

  get canRunMacro(): boolean {
    if (
      ![MachineControllerType.Grbl, MachineControllerType.Maslow, MachineControllerType.Marlin].includes(
        this._controllerType,
      )
    ) {
      return false;
    }
    return this.isReady || this.isRunning;
  }

  get canAdjustSpindle(): boolean {
    if (
      ![MachineControllerType.Grbl, MachineControllerType.Maslow, MachineControllerType.Marlin].includes(
        this._controllerType,
      )
    ) {
      return false;
    }
    return this.isReady || this.isPaused;
  }

  get isAgitated(): boolean {
    if (this._controllerType === MachineControllerType.Marlin) {
      return false;
    }
    return this.isRunning;
  }

  _stateCheck(controllerTypeMap: { [key: string]: MachineState }): boolean {
    return this.stateValue === (controllerTypeMap[this._controllerType] || controllerTypeMap[DEFAULT]);
  }
}

export default ActiveState;
