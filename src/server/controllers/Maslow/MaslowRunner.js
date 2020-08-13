import events from 'events';
import _ from 'lodash';
import MaslowLineParser from './MaslowLineParser';
import MaslowLineParserResultStatus from './MaslowLineParserResultStatus';
import MaslowLineParserResultOk from './MaslowLineParserResultOk';
import MaslowLineParserResultError from './MaslowLineParserResultError';
import MaslowLineParserResultAlarm from './MaslowLineParserResultAlarm';
import MaslowLineParserResultParserState from './MaslowLineParserResultParserState';
import MaslowLineParserResultParameters from './MaslowLineParserResultParameters';
import MaslowLineParserResultFeedback from './MaslowLineParserResultFeedback';
import MaslowLineParserResultSettings from './MaslowLineParserResultSettings';
import MaslowLineParserResultStartup from './MaslowLineParserResultStartup';
import MaslowLineParserResultPositionalError from './MaslowLineParserResultPositionalError';
import MaslowLineParserResultVersion from './MaslowLineParserResultVersion';
import {
    MASLOW_FIRMWARE_CLASSIC,
    MASLOW_FIRMWARE_DUE,
} from './constants';

class MaslowRunner extends events.EventEmitter {
    settings = {
        protocol: {
            name: 'Grbl',
            version: '',
        },
        firmware: {
            name: '',
            version: '',
        },
        parameters: {
        },
        settings: {
        }
    };

    constructor(controller) {
        super();
        this.controller = controller;
    }

    parser = new MaslowLineParser();

    parse(data) {
        data = ('' + data).replace(/\s+$/, '');
        if (!data) {
            return;
        }

        this.emit('raw', { raw: data });

        const result = this.parser.parse(data) || {};
        const { type, payload } = result;

        if (type === MaslowLineParserResultPositionalError) {
            return;
        }
        if (type === MaslowLineParserResultStatus) {
            this.controller.memory.updateStatus(payload);
            return;
        }
        if (type === MaslowLineParserResultOk) {
            this.emit('ok', payload);
            return;
        }
        if (type === MaslowLineParserResultError) {
            // https://nodejs.org/api/events.html#events_error_events
            // As a best practice, listeners should always be added for the 'error' events.
            this.emit('error', payload);
            return;
        }
        if (type === MaslowLineParserResultAlarm) {
            this.emit('alarm', payload);
            return;
        }
        if (type === MaslowLineParserResultParserState) {
            this.controller.memory.updateParserState(payload);
            return;
        }
        if (type === MaslowLineParserResultParameters) {
            const { name, value } = payload;
            const nextSettings = {
                ...this.settings,
                parameters: {
                    ...this.settings.parameters,
                    [name]: value
                }
            };
            if (!_.isEqual(this.settings.parameters[name], nextSettings.parameters[name])) {
                this.settings = nextSettings; // enforce change
            }
            this.emit('parameters', payload);
            return;
        }
        if (type === MaslowLineParserResultFeedback) {
            this.emit('feedback', payload);
            return;
        }
        if (type === MaslowLineParserResultSettings) {
            const { name, value } = payload;
            const nextSettings = {
                ...this.settings,
                settings: {
                    ...this.settings.settings,
                    [name]: value
                }
            };
            if (this.settings.settings[name] !== nextSettings.settings[name]) {
                this.settings = nextSettings; // enforce change
            }
            this.emit('settings', payload);
            return;
        }
        if (type === MaslowLineParserResultVersion) {
            const nextSettings = {
                ...this.settings,
                firmware: {
                    ...this.settings.firmware,
                    name: payload.name,
                    version: payload.version,
                }
            };
            this.settings = nextSettings;
            this.emit('version', payload);
            return;
        }
        if (type === MaslowLineParserResultStartup) {
            const nextSettings = {
                ...this.settings,
                protocol: {
                    ...this.settings.protocol,
                    name: payload.name,
                    version: payload.version,
                }
            };
            this.settings = nextSettings;
            this.emit('startup', payload);
            return;
        }
        if (data.length > 0) {
            this.emit('others', payload);
            return;
        }
    }

    isMaslowClassic() {
        return this.settings.firmware && this.settings.firmware.name === MASLOW_FIRMWARE_CLASSIC;
    }

    isMaslowDue() {
        return this.settings.firmware && this.settings.firmware.name === MASLOW_FIRMWARE_DUE;
    }
}

export default MaslowRunner;
