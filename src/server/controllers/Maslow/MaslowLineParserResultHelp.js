class MaslowLineParserResultHelp {
    static parse(line) {
        // * Maslow v1.1
        //   [HLP:]
        const r = line.match(/^\[(?:HLP:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultHelp,
            payload: payload
        };
    }
}

export default MaslowLineParserResultHelp;
