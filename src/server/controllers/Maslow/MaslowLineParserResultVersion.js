class MaslowLineParserResultVersion {
    static parse(line) {
        // * Maslow v1.1
        //   [VER:]
        const r = line.match(/^\[(?:VER:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultVersion,
            payload: payload
        };
    }
}

export default MaslowLineParserResultVersion;
