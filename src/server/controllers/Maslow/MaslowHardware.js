import _ from 'lodash';
import {
    GRBL_SETTINGS,
    MASLOW_FIRMWARE_CLASSIC,
    MASLOW_FIRMWARE_DUE,
} from './constants';

// Generic settings class that can interpret Grbl settings for the frontend UI
class MaslowHardware {
    protocol = {
        name: 'Grbl',
        version: '',
    };

    firmware = {
        name: '',
        pcb: '',
        version: '',
    };

    parameters = {};

    settings = {};

    // The startup grbl is interpreted into a map, such as:
    // '$38': { 'value': 2, 'message': 'chain over sprocket', 'units': 'boolean'}
    grbl = {};

    isMaslowClassic() {
        return this.firmware && this.firmware.name === MASLOW_FIRMWARE_CLASSIC;
    }

    isMaslowDue() {
        return this.firmware && this.firmware.name === MASLOW_FIRMWARE_DUE;
    }

    getInitCommands() {
        // Classic needs to print firmware & reset units when init-ing.
        return this.isMaslowClassic() ? ['$$', 'B05', 'G21'] : ['$$'];
    }

    toDictionary() {
        return {
            'protocol': { ...this.protocol },
            'firmware': { ...this.firmware },
            'parameters': { ...this.parameters },
            'settings': { ...this.settings },
            'grbl': { ...this.grbl },
        };
    }

    // During startup, Grbl outputs its variable + values + comments.
    // If the comment is present, it will be used to populate message/description/units.
    // Otherwise, this will fall back on GRBL_SETTINGS for this metadata.
    setGrbl(code, value, message) {
        const map = this.grbl[code] || {};
        map.name = code;
        map.value = value;
        if (!message) {
            const setting = _.find(GRBL_SETTINGS, { setting: code });
            if (setting) {
                map.message = setting.message;
                map.description = setting.description;
                map.units = setting.units;
            }
        } else {
            const parts = message.split(', ');
            map.message = parts[0];
            if (parts.length > 1) {
                map.units = parts[1];
            }
        }
        this.grbl[code] = map;
        return this.grbl[code];
    }
}

export default MaslowHardware;
