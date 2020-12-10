import _ from 'lodash';

class MaslowLineParserResultSettings {
    static parse(line) {
        const r = line.match(/^(\$[^=]+)=([^ ]*)\s*(.*)/);
        if (!r) {
            return null;
        }

        if (r[1].toLowerCase() === '$x') {
            // Exclude help message "$x=val";
            return null;
        }

        const payload = {
            name: r[1],
            value: r[2],
            message: _.trim(r[3], '()')
        };

        return {
            type: MaslowLineParserResultSettings,
            payload: payload
        };
    }
}

export default MaslowLineParserResultSettings;
