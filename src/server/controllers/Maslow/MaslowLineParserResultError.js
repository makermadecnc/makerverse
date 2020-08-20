// https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl#grbl-response-meanings
class MaslowLineParserResultError {
    static parse(line) {
        const r = line.match(/^error:\s*(.+)$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultError,
            payload: payload
        };
    }
}

export default MaslowLineParserResultError;
