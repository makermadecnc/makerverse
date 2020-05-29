// https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl#feedback-messages
class MaslowLineParserResultFeedback {
    // * Maslow v0.9
    //   []
    // * Maslow v1.1
    //   [MSG:]
    static parse(line) {
        const r = line.match(/^\[(?:MSG:)?(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultFeedback,
            payload: payload
        };
    }
}

export default MaslowLineParserResultFeedback;
