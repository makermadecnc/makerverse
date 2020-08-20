import _trim from 'lodash/trim';

const pattern = new RegExp(/^([a-zA-Z0-9]+)\s+((?:\d+\.){1,2}\d+[a-zA-Z0-9\-\.]*)([^\[]*\[[^\]]+\].*)?/);

class MaslowLineParserResultStartup {
    // Maslow 0.9j ['$' for help]
    // Maslow 1.1d ['$' for help]
    // Maslow 1.1
    // Maslow 1.1h: LongMill build ['$' for help]
    // Maslow 1.1h ['$' for help] LongMill build Feb 25, 2020
    // gCarvin 2.0.0 ['$' for help]
    static parse(line) {
        return MaslowLineParserResultStartup.parseGrbl(line) ||
            MaslowLineParserResultStartup.parseMaslowClassic(line);
    }

    static parseGrbl(line) {
        const r = line.match(pattern);
        if (!r) {
            return null;
        }

        const name = r[1];
        const version = r[2];
        const message = _trim(r[3]);

        const payload = {
            name: name,
            version: version,
            message,
        };

        return {
            type: MaslowLineParserResultStartup,
            payload: payload
        };
    }

    static parseMaslowClassic(line) {
        const payload = {
            message: line
        };
        const parts = line.split(' ');
        if (parts.length >= 2 && parts[0] === 'Grbl') {
            payload.name = 'Grbl';
            payload.version = parts[1].substr(1);
        } else {
            return null;
        }
        return {
            type: MaslowLineParserResultStartup,
            payload: payload
        };
    }
}

export default MaslowLineParserResultStartup;
