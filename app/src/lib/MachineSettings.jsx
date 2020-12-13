/*eslint no-bitwise: ["error", { "allow": ["<<", "&", "&=", "|=", "~"] }] */
import _ from 'lodash';
import log from 'js-logger';
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

// How many digits to round?
const NUMBER_PRECISION = {
    machineHeight: 1,
    machineWidth: 1,
    motorOffsetY: 1,
    distBetweenMotors: 1,
    rotationDiskRadius: 1,
    origChainLength: 1,
    chainLength: 1,
    chainOverSprocket: 0,
    leftChainTolerance: 5,
    rightChainTolerance: 5,
    sledWeight: 1,
    sledWidth: 1,
    sledHeight: 1,
    sledCg: 1,
    mainStepsPerRev: 1,
    distancePerRotation: 1,
    zAxisRpm: 1,
    zAxisDistancePerRotation: 2,
    zAxisRes: 2,
    kpPos: 2,
    kiPos: 2,
    kdPos: 2,
    posPro: 2,
    kpVel: 2,
    kiVel: 2,
    kdVel: 2,
    velPro: 2,
    zAxisKpPos: 2,
    zAxisKiPos: 2,
    zAxisKdPos: 2,
    zAxisPosPro: 2,
    zAxisKpVel: 2,
    zAxisKiVel: 2,
    zAxisKdVel: 2,
    zAxisVelPro: 2,
    chainElongationFactor: 8,
    positionErrorAlarmLimit: 1,
    reserved1: 2,
    reserved2: 2,
    chainSagCorrection: 5,
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
        sledCg: ['sled cg'],
        mainStepsPerRev: ['main steps per revolution'],
        distancePerRotation: ['distance / rotation'],
        kinematicsType: ['kinematics type'],
        zAxisRpm: ['max z axis rpm'],
        zAxisDistancePerRotation: ['z axis distance / rotation'],
        zAxisRes: ['z-axis travel resolution', 'z axis steps per revolution'],
        kpPos: ['main kp pos'],
        kiPos: ['main ki pos'],
        kdPos: ['main kd pos'],
        posPro: ['main pos pro'],
        kpVel: ['main kp vel'],
        kiVel: ['main ki vel'],
        kdVel: ['main kd vel'],
        velPro: ['main velocity pro'],
        zAxisKpPos: ['z axis kp pos'],
        zAxisKiPos: ['z axis ki pos'],
        zAxisKdPos: ['z axis kd pos'],
        zAxisPosPro: ['z axis pos pro'],
        zAxisKpVel: ['z axis kp vel'],
        zAxisKiVel: ['z axis ki vel'],
        zAxisKdVel: ['z axis kd vel'],
        zAxisVelPro: ['z axis velocity pro'],
        positionErrorAlarmLimit: ['position error alarm limit'],
        reserved1: ['reserved1'],
        reserved2: ['reserved2'],
        chainSagCorrection: ['chain sag correction'],
    },
};

// Acts as an intermediary between controller's settings ($13, etc.)
// And human-readable settings (reportsImperial, etc.)
class MachineSettings {
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
        this._grbl = controllerSettings.grbl || {};

        this._unmappedSettings = {};
        this._mappedSettings = {};
        Object.keys(this._grbl).forEach((code) => {
            const mapped = this.mapSetting(code);
            if (!mapped) {
                this._unmappedSettings[code] = this._grbl[code];
            } else {
                this._unmappedSettings[code] = mapped;
                this._mappedSettings[mapped.key] = mapped;
            }
        });

        this._errors = [];
        Object.keys(this.requiredSettings).forEach((key) => {
            if (!_.has(this._mappedSettings, key)) {
                this._errors.push(`Missing setting: ${key}`);
            }
        });
    }

    mapSetting(code) {
        if (_.has(this._unmappedSettings, code)) {
            return this._unmappedSettings[code];
        }
        const allSettings = this.allSettings;
        const g = this._grbl[code];
        const msg = `${g.message}, ${g.units}`.toLowerCase();
        let mapped = null;
        Object.keys(allSettings).forEach((key) => {
            allSettings[key].forEach((prefix) => {
                if (msg.startsWith(prefix)) {
                    mapped = { ...g, code: code, key: key };
                }
            });
        });
        return mapped;
    }

    has(key) {
        return _.has(this._mappedSettings, key);
    }

    getSetting(keyOrCode) {
        if (_.has(this._mappedSettings, keyOrCode)) {
            return this._mappedSettings[keyOrCode];
        }
        if (_.has(this._unmappedSettings, keyOrCode)) {
            return this._unmappedSettings[keyOrCode];
        }
        return null;
    }

    getValue(keyOrCode, defValue) {
        const setting = this.getSetting(keyOrCode);
        if (!setting) {
            return defValue;
        }
        return this._sanitizeSettingValue(setting, setting.value);
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
            val &= ~(bit);
        }
        this.write({ [setting.name]: val });
    }

    get all() {
        return this._unmappedSettings;
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

    // Before writing a setting value, do some checks.
    _sanitizeSettingValue(setting, val) {
        if (!_.has(NUMBER_PRECISION, setting.key)) {
            return val;
        }
        const number = Number(val);
        if (typeof number === 'number') {
            val = number;
        }
        if (typeof val === 'number') {
            return val.toFixed(NUMBER_PRECISION[setting.key]);
        }
        return val;
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
            const setting = this.getSetting(code);
            if (!setting) {
                log.error(`Invalid setting cannot be written: ${code}`);
                return;
            }
            const val = this._sanitizeSettingValue(setting, map[code]);
            lines.push(`${setting.name}=${val}`);
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
