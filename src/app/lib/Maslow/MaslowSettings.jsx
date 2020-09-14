import _ from 'lodash';

// Translates well-known key names (e.g., distBetweenMotors) into GRBL values appropriate to the
// controller by using the settings that came from the controller.
class MaslowSettings {
    _controllerSettings = {};

    _maslowSettings = {};

    _requiredSettings = {
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
    };

    _optionalSettings = {
        sledWidth: ['sled width'],
        sledHeight: ['sled height'],
        kinematicsType: ['kinematics type'],
        reportInInches: ['report in inches'],
    };

    _errors = [];

    constructor(controllerSettings) {
        this.update(controllerSettings || {});
    }

    update(controllerSettings) {
        this._controllerSettings = { ...this._controllerSettings, controllerSettings };
        const allSettings = { ...this._requiredSettings, ...this._optionalSettings };

        Object.keys(controllerSettings.grbl || {}).forEach((code) => {
            const g = controllerSettings.grbl[code];
            const msg = `${g.message}, ${g.units}`.toLowerCase();
            Object.keys(allSettings).forEach((key) => {
                allSettings[key].forEach((prefix) => {
                    if (msg.startsWith(prefix)) {
                        this._maslowSettings[key] = g;
                    }
                });
            });
        });

        this._errors = [];
        Object.keys(this._requiredSettings).forEach((key) => {
            if (!_.has(this._maslowSettings, key)) {
                this._errors.push(`Missing setting: ${key}`);
            }
        });
    }

    getValue(key, defValue) {
        if (!_.has(this._maslowSettings, key)) {
            return defValue;
        }
        return _.get(this._maslowSettings, key).value;
    }

    get map() {
        return this._maslowSettings;
    }

    get errors() {
        return this._errors;
    }

    get isValid() {
        return this._errors.length <= 0;
    }
}

export default MaslowSettings;
