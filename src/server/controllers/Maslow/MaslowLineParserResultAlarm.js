import _ from 'lodash';

// https://github.com/grbl/grbl/wiki/Interfacing-with-Gribl#alarms
class MaslowLineParserResultAlarm {
    static parse(line) {
        let alarmMsg = this.parseGenericAlarm(line);
        if (!alarmMsg) {
            return null;
        }

        if (alarmMsg.startsWith('The sled is not keeping up')) {
            alarmMsg = '3'; // Translate into "Abort during cycle"
        }

        return {
            type: MaslowLineParserResultAlarm,
            payload: {
                message: alarmMsg,
            }
        };
    }

    static parseGenericAlarm(line) {
        if (!line.toLowerCase().startsWith('alarm:')) {
            return null;
        }
        return _.trim(line.substr('alarm:'.length));
    }
}

export default MaslowLineParserResultAlarm;
