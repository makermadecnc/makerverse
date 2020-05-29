// https://github.com/grbl/grbl/wiki/Interfacing-with-Maslow#alarms
class MaslowLineParserResultAlarm {
    static parse(line) {
        const r = line.match(/^ALARM:\s*(.+)$/);
        if (!r) {
            return null;
        }

        const payload = {
            message: r[1]
        };

        return {
            type: MaslowLineParserResultAlarm,
            payload: payload
        };
    }
}

export default MaslowLineParserResultAlarm;
