import _ from 'lodash';

// AXIS
export const AXIS_E = 'e';
export const AXIS_X = 'x';
export const AXIS_Y = 'y';
export const AXIS_Z = 'z';
export const AXIS_A = 'a';
export const AXIS_B = 'b';
export const AXIS_C = 'c';

// Imperial System
export const IMPERIAL_UNITS = 'in';
// Metric System
export const METRIC_UNITS = 'mm';

// Controller
export const GRBL = 'Grbl';
export const MARLIN = 'Marlin';
export const SMOOTHIE = 'Smoothie';
export const TINYG = 'TinyG';
export const MASLOW = 'Maslow';
export const CONTROLLERS = [GRBL, MARLIN, SMOOTHIE, TINYG, MASLOW];

// Get one of the const values from a name
// e.g., "mAsLoW" => MASLOW
export function controllerTypeToConst(name) {
  const n = name.toUpperCase();
  if (n === 'tiny_g') {
    return TINYG;
  }
  return _.find(CONTROLLERS, (c) => c.toUpperCase() === n);
}

// Workflow State
export const WORKFLOW_STATE_IDLE = 'idle';
export const WORKFLOW_STATE_PAUSED = 'paused';
export const WORKFLOW_STATE_RUNNING = 'running';

// Machine Active States
export const ACTIVE_STATE_IDLE = 'Idle';
export const ACTIVE_STATE_RUN = 'Run';
export const ACTIVE_STATE_HOLD = 'Hold';
export const ACTIVE_STATE_DOOR = 'Door';
export const ACTIVE_STATE_HOME = 'Home';
export const ACTIVE_STATE_SLEEP = 'Sleep';
export const ACTIVE_STATE_ALARM = 'Alarm';
export const ACTIVE_STATE_CHECK = 'Check';
