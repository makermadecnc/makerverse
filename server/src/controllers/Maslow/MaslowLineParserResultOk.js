class MaslowLineParserResultOk {
    static parse(line) {
        const r = line.match(/^ok$/);
        if (!r) {
            return null;
        }

        const payload = {};

        return {
            type: MaslowLineParserResultOk,
            payload: payload
        };
    }
}

export default MaslowLineParserResultOk;
