class MaslowLineParserResultPositionalError {
    // [PE:0.00,0.00,127,1761.40,1765.29]
    static parse(line) {
        const r = line.match(/^\[PE:(.+)\]$/);
        if (!r) {
            return null;
        }
        const values = r[1].split(',');
        const payload = {
            leftAxisError: Number(values[0]),
            rightAxisError: Number(values[1]),
            bufferSpaceAvailable: Number(values[2]),
        };
        return {
            type: MaslowLineParserResultPositionalError,
            payload: payload
        };
    }
}

export default MaslowLineParserResultPositionalError;
