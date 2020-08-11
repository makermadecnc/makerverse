import GrblLineParserResultVersion from '../Grbl/GrblLineParserResultVersion';

class MaslowLineParserResultVersion {
    static parse(line) {
        const grbl = GrblLineParserResultVersion.parse(line);
        const payload = { };
        if (grbl) { // Maslow DUE
            payload.message = grbl.payload.message;
        } else { // Maslow Classic
            const r = line.match(/^PCB v(.+) Detected$/);
            if (!r) {
                return null;
            }
            payload.message = r[1];
        }

        return {
            type: MaslowLineParserResultVersion,
            payload: payload
        };
    }
}

export default MaslowLineParserResultVersion;
