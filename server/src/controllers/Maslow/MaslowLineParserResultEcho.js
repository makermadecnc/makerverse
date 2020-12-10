class MaslowLineParserResultEcho {
    static parse(line) {
        // * Maslow v1.1
        //   [echo:]
        const r = line.match(/^\[(?:echo:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultEcho,
            payload: payload
        };
    }
}

export default MaslowLineParserResultEcho;
