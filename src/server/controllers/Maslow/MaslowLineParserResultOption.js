class MaslowLineParserResultOption {
    static parse(line) {
        // * Maslow v1.1
        //   [OPT:]
        const r = line.match(/^\[(?:OPT:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultOption,
            payload: payload
        };
    }
}

export default MaslowLineParserResultOption;
