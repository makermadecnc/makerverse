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
export const IMPERIAL_STEPS = [
    0.01,
    0.02,
    0.03,
    0.05,
    0.1,
    0.2,
    0.3,
    0.5,
    1, // Default
    2,
    3,
    4,
    6,
    8,
    10,
    15,
    20,
    30,
    40
];

// Metric System
export const METRIC_UNITS = 'mm';
export const METRIC_STEPS = [
    0.05,
    0.1,
    0.2,
    0.3,
    0.5,
    1, // Default
    2,
    3,
    5,
    7,
    10,
    15,
    20,
    30,
    40,
    50,
    75,
    100,
    150,
    200,
    300,
    500
];

// Controller
export const GRBL = 'Grbl';
export const MARLIN = 'Marlin';
export const SMOOTHIE = 'Smoothie';
export const TINYG = 'TinyG';
export const MASLOW = 'Maslow';
export const CONTROLLERS = [
    GRBL,
    MARLIN,
    SMOOTHIE,
    TINYG,
    MASLOW,
];

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
