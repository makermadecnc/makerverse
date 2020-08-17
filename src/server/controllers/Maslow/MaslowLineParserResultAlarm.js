import _ from 'lodash';

// https://github.com/grbl/grbl/wiki/Interfacing-with-Maslow#alarms
class MaslowLineParserResultAlarm {
    static parse(line) {
        const payload = this.parseErrorStrings(line) ?? this.parseGenericAlarm(line);
        if (!payload) {
            return null;
        }

        return {
            type: MaslowLineParserResultAlarm,
            payload: payload
        };
    }

    static parseErrorStrings(line) {
        const errs = ['Buffer Overflow!'];
        for (var i = 0; i < errs.length; i++) {
            if (errs[i] === line) {
                return line;
            }
        }
        return null;
    }

    static parseGenericAlarm(line) {
        if (!line.toLowerCase().startsWith('alarm:')) {
            return null;
        }
        return _.trim(line.substr('alarm:'.length));
    }
}

export default MaslowLineParserResultAlarm;
