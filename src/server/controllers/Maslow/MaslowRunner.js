import events from 'events';
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

        if (type === MaslowLineParserResultPositionalError) {
            this.emit('feedback', payload);
            return;
        }
        if (type === MaslowLineParserResultStatus) {
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
            this.emit('alarm', payload);
            return;
        }
        if (type === MaslowLineParserResultParserState) {
            this.emit('parserstate', payload);
            return;
        }
        if (type === MaslowLineParserResultParameters) {
            this.emit('parameters', payload);
            return;
        }
        if (type === MaslowLineParserResultFeedback) {
            this.emit('feedback', payload);
            return;
        }
        if (type === MaslowLineParserResultSettings) {
            this.emit('settings', payload);
            return;
        }
        if (type === MaslowLineParserResultVersion) {
            this.emit('firmware', payload);
            return;
        }
        if (type === MaslowLineParserResultStartup) {
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
