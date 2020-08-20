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

class MaslowRunner extends events.EventEmitter {
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

        // delete raw for value parsing
        const values = { ...payload };
        delete values.raw;

        if (type === MaslowLineParserResultPositionalError) {
            this.controller.memory.updateStatus({ 'err': values });
            this.emit('status', payload);
            return;
        }
        if (type === MaslowLineParserResultStatus) {
            this.controller.memory.updateStatus(values);
            this.emit('status', payload);
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
            this.controller.memory.updateStatus({ alarm: payload.message });
            this.emit('alarm', payload);
            return;
        }
        if (type === MaslowLineParserResultParserState) {
            this.controller.memory.updateParserState(values);
            this.emit('parserstate', payload);
            return;
        }
        if (type === MaslowLineParserResultParameters) {
            const { name, value } = payload;
            _.set(this.controller.hardware.parameters, name, value);
            this.emit('parameters', payload);
            return;
        }
        if (type === MaslowLineParserResultFeedback) {
            this.emit('feedback', payload);
            return;
        }
        if (type === MaslowLineParserResultSettings) {
            const { name, value, message } = payload;
            const setting = this.controller.hardware.setGrbl(name, value, message);
            this.emit('settings', { ...payload, ...setting });
            return;
        }
        if (type === MaslowLineParserResultVersion) {
            const { name, pcb, version } = payload;
            this.controller.hardware.firmware.name = name;
            if (pcb) {
                this.controller.hardware.firmware.pcb = pcb;
            }
            if (version) {
                this.controller.hardware.firmware.version = version;
            }
            this.emit('firmware', this.controller.hardware.firmware);
            return;
        }
        if (type === MaslowLineParserResultStartup) {
            const { name, version } = payload;
            this.controller.hardware.protocol = {
                'name': name,
                'version': version,
            };
            this.emit('startup', payload);
            return;
        }
        if (data.length > 0) {
            this.emit('others', payload);
            return;
        }
    }
}

export default MaslowRunner;
