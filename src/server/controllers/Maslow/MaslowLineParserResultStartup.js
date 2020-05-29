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
        const r = line.match(pattern);
        if (!r) {
            return null;
        }

        const firmware = r[1];
        const version = r[2];
        const message = _trim(r[3]);

        const payload = {
            firmware,
            version,
            message,
        };

        return {
            type: MaslowLineParserResultStartup,
            payload: payload
        };
    }
}

export default MaslowLineParserResultStartup;
