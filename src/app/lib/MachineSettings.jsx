/*eslint no-bitwise: ["error", { "allow": ["<<", "&", "&=", "|="] }] */
import _ from 'lodash';
import log from 'app/lib/log';
import {
    MASLOW,
    GRBL,
    TINYG,
} from '../constants';

const GRBL_SETTINGS = {
    reportInInches: ['report in inches'],
    stepDirectionInvert: ['step direction invert'],
    xAxisRes: ['x-axis travel resolution'],
    xAxisMin: ['x-axis minimum travel'],
    xAxisMax: ['x-axis maximum travel'],
    yAxisRes: ['y-axis travel resolution'],
    yAxisMin: ['y-axis minimum travel'],
    yAxisMax: ['y-axis maximum travel'],
    zAxisRes: ['z-axis travel resolution'],
    zAxisMin: ['z-axis minimum travel'],
    zAxisMax: ['z-axis maximum travel'],
};

const REQUIRED_SETTINGS = {
    [MASLOW]: {
        machineHeight: ['machine height'],
        machineWidth: ['machine width'],
        motorOffsetY: ['motor height'],
        distBetweenMotors: ['motor distance'],
        rotationDiskRadius: ['rotation radius'],
        origChainLength: ['calibration chain length'],
        chainLength: ['full length of chain'],
        chainOverSprocket: ['chain over sprocket'],
        leftChainTolerance: ['chain tolerance, left chain'],
        rightChainTolerance: ['chain tolerance, right chain'],
        chainElongationFactor: ['chain stretch factor'],
        sledWeight: ['sled weight', 'weight of sled'],
    },
    [GRBL]: GRBL_SETTINGS,
};

const OPTIONAL_SETTINGS = {
    [MASLOW]: {
        ...GRBL_SETTINGS,
        sledWidth: ['sled width'],
        sledHeight: ['sled height'],
        kinematicsType: ['kinematics type'],
        zAxisRes: ['z-axis travel resolution', 'z axis steps per revolution'],
    },
};

// Acts as an intermediary between controller's settings ($13, etc.)
// And human-readable settings (reportsImperial, etc.)
class MachineSettings {
    _controllerSettings = {};

    _mappedSettings = {};

    _unmappedSettings = {};

    _errors = [];

    constructor(workspace, controllerType, controllerSettings) {
        this._workspace = workspace;
        this._controllerType = controllerType;
        this.update(controllerSettings || {});
    }

    get requiredSettings() {
        return REQUIRED_SETTINGS[this._controllerType] || {};
    }

    get optionalSettings() {
        return OPTIONAL_SETTINGS[this._controllerType] || {};
    }

    get allSettings() {
        return { ...this.requiredSettings, ...this.optionalSettings };
    }

    update(controllerSettings) {
        this._controllerSettings = { ...this._controllerSettings, controllerSettings };
        const requiredSettings = this.requiredSettings;
        const allSettings = this.allSettings;

        Object.keys(controllerSettings.grbl || {}).forEach((code) => {
            const g = controllerSettings.grbl[code];
            const msg = `${g.message}, ${g.units}`.toLowerCase();
            let mapped = false;
            Object.keys(allSettings).forEach((key) => {
                allSettings[key].forEach((prefix) => {
                    if (msg.startsWith(prefix)) {
                        this._mappedSettings[key] = g;
                        mapped = true;
                    }
                });
            });
            if (!mapped) {
                this._unmappedSettings[code] = g;
            }
        });

        this._errors = [];
        Object.keys(requiredSettings).forEach((key) => {
            if (!_.has(this._mappedSettings, key)) {
                this._errors.push(`Missing setting: ${key}`);
            }
        });
    }

    has(key) {
        return _.has(this._mappedSettings, key);
    }

    getValue(key, defValue) {
        if (!this.has(key)) {
            return defValue;
        }
        return _.get(this._mappedSettings, key).value;
    }

    reportsImperial(isInImperialUnitsMode, reportType) {
        if ([MASLOW, GRBL].includes(this._controllerType)) {
            // The Maslow Mega reports in inches when in G20 mode.
            const reportsSameAsModal = this._controllerType === MASLOW;
            const impFlag = isInImperialUnitsMode ? 1 : 0;
            const defReportInches = reportsSameAsModal ? impFlag : 0;
            // Since Grbl & Due always has the setting present, the default will not apply to it.
            const reportInInches = this.getValue('reportInInches', defReportInches);
            return reportInInches > 0;
        }

        if (this._controllerType === TINYG && reportType === 'mpos') {
            // https://github.com/synthetos/g2/wiki/Status-Reports
            // Canonical machine position are always reported in millimeters with no offsets.
            return false;
        }

        return isInImperialUnitsMode;
    }

    _getAxisBit(axisKey) {
        const idx = ['x', 'y', 'z'].indexOf(axisKey.toLowerCase());
        return (1 << idx);
    }

    // usage: isAxisInverted('x')
    isAxisInverted(axisKey) {
        const inverts = this.getValue('stepDirectionInvert', 0);
        const bit = this._getAxisBit(axisKey);
        return inverts & bit;
    }

    setAxisInverted(axisKey, inverted) {
        if (!this.has('stepDirectionInvert')) {
            return;
        }
        const setting = _.get(this._mappedSettings, 'stepDirectionInvert');
        const bit = this._getAxisBit(axisKey);
        let val = setting.value;
        if (inverted) {
            val |= bit;
        } else {
            val &= bit;
        }
        this.write({ [setting.name]: val });
    }

    get map() {
        return this._mappedSettings;
    }

    get errors() {
        return this._errors;
    }

    get isValid() {
        return this._errors.length <= 0;
    }

    export(keys = null) {
        const ret = {};
        keys = keys || Object.keys(this.allSettings);
        keys.forEach((key) => {
            if (!this._mappedSettings[key]) {
                return;
            }
            ret[key] = this._mappedSettings[key].value;
        });
        return ret;
    }

    import(map, callback = null, delay = 2000) {
        this.write(map, callback, delay);
    }

    // Given a code: value map, write all the settings.
    write(map, callback = null, delay = 2000) {
        const cmds = [];
        if (!this._workspace.isReady) {
            cmds.push('reset');
            cmds.push('unlock');
        }
        const lines = [];
        Object.keys(map).forEach((code) => {
            if (code.startsWith('$')) {
                lines.push(`${code}=${map[code]}`);
            } else if (_.has(this._mappedSettings, code)) {
                const setting = _.get(this._mappedSettings, code);
                lines.push(`${setting.name}=${map[code]}`);
            } else {
                log.error(`Invalid setting cannot be written: ${code}`);
            }
        });

        this._workspace.blockingText = 'Preparing Machine...';
        this._workspace.writeCommands(cmds, () => {
            this._workspace.blockingText = 'Applying Settings...';
            this._workspace.writeLines(lines, () => {
                this._workspace.blockingText = 'Refreshing Settings...';
                this._workspace.controller.writeln('$$');
                setTimeout(() => {
                    this._workspace.blockingText = null;
                    if (callback) {
                        callback();
                    }
                }, delay);
            }, delay);
        }, delay);
    }
}

export default MachineSettings;
