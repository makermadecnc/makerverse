// https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl#grbl-response-meanings
class MaslowLineParserResultError {
    static parse(line) {
        const errCode = this.parseErrorStrings(line) || this.parseGenericError(line);
        if (!errCode) {
            return null;
        }

        const payload = {
            message: errCode
        };

        return {
            type: MaslowLineParserResultError,
            payload: payload
        };
    }

    static parseGenericError(line) {
        const r = line.match(/^error:\s*(.+)$/);
        return r ? r[1] : null;
    }

    static parseErrorStrings(line) {
        const errs = {
            'Buffer Overflow!': 11, // Maslow Classic: STATUS_OVERFLOW
            'Unable to find valid machine position for chain lengths': 39,
        };
        const errStrs = Object.keys(errs);
        for (let i = 0; i < errStrs.length; i++) {
            const str = errStrs[i];
            if (line.includes(str)) {
                // Return the error code.
                return errs[str];
            }
        }
        return null;
    }
}

export default MaslowLineParserResultError;
