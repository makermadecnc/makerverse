import { GRBL } from '../constants';

const defaultState = {
  session: {
    name: '',
    token: '',
  },
  widgets: {
    axes: {
      minimized: false,
      axes: ['x', 'y', 'z'],
      jog: {
        keypad: false,
        imperial: {
          step: 0,
          distances: [],
        },
        metric: {
          step: 0,
          distances: [],
        },
      },
      mdi: {
        disabled: false,
      },
      shuttle: {
        feedrateMin: 500,
        feedrateMax: 2000,
        hertz: 10,
        overshoot: 1,
      },
    },
    connection: {
      minimized: false,
      controller: {
        type: GRBL,
      },
      port: '', // will be deprecated in v2
      baudrate: 38400, // will be deprecated in v2
      connection: {
        type: 'serial',
        serial: {
          // Hardware flow control (RTS/CTS)
          rtscts: false,
        },
      },
      autoReconnect: true,
    },
    console: {
      minimized: false,
    },
    gcode: {
      minimized: false,
    },
    grbl: {
      minimized: false,
      panel: {
        queueReports: {
          expanded: true,
        },
        statusReports: {
          expanded: true,
        },
        modalGroups: {
          expanded: true,
        },
      },
    },
    laser: {
      minimized: false,
      panel: {
        laserTest: {
          expanded: true,
        },
      },
      test: {
        power: 0,
        duration: 0,
        maxS: 1000,
      },
    },
    maslow: {
      minimized: false,
    },
    webcam: {
      minimized: false,
    },
    marlin: {
      minimized: false,
      panel: {
        heaterControl: {
          expanded: true,
        },
        statusReports: {
          expanded: false,
        },
        modalGroups: {
          expanded: false,
        },
      },
      heater: {
        // Filament          | PLA                | ABS
        // ----------------- | ------------------ | --------------------
        // Uses              | Consumer Products  | Functional Parts
        // Strength          | Medium             | Medium
        // Flexibility       | Low                | Medium
        // Durability        | Medium             | High
        // Print Temperature | 180-230°C          | 210-250°C
        // Bed Temperature   | 20-60°C (optional) | 80-110°C (mandatory)
        extruder: 180,
        heatedBed: 60,
      },
    },
    probe: {
      minimized: false,
      probeCommand: 'G38.2',
      useTLO: false,
      probeDepth: 10,
      probeFeedrate: 20,
      touchPlateHeight: 10,
      retractionDistance: 4,
    },
    spindle: {
      minimized: false,
      speed: 1000,
    },
    visualizer: {
      minimized: false,

      // 3D View
      disabled: false,
      projection: 'orthographic', // 'perspective' or 'orthographic'
      cameraMode: 'pan', // 'pan' or 'rotate'
      gcode: {
        displayName: true,
      },
      objects: {
        limits: {
          visible: true,
        },
        coordinateSystem: {
          visible: true,
        },
        gridLineNumbers: {
          visible: true,
        },
        cuttingTool: {
          visible: true,
        },
      },
    },
  },
};

export default defaultState;
