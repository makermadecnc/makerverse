class MaslowLineParserResultPositionalError {
    // [PE:0.00,0.00,127,1761.40,1765.29]
    static parse(line) {
        const payload = this.parseErrorStrings(line) || this.parsePositionalError(line);
        return !payload ? null : {
            type: MaslowLineParserResultPositionalError,
            payload: payload
        };
    }

    static parseErrorStrings(line) {
        if (line.indexOf('Unable to find valid machine position for chain lengths') >= 0) {
            // Both Classic & Due support this line.
            return { positionError: true };
        }
        return null;
    }

    static parsePositionalError(line) {
        const r = line.match(/^\[PE:(.+)\]$/);
        if (!r) {
            return null;
        }
        const values = r[1].split(',');
        return {
            leftAxisError: Number(values[0]),
            rightAxisError: Number(values[1]),
            bufferSpaceAvailable: Number(values[2]),
        };
    }
}

export default MaslowLineParserResultPositionalError;
