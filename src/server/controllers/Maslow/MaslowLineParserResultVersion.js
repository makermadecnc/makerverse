import _trim from 'lodash/trim';
import {
    MASLOW_FIRMWARE_CLASSIC,
    MASLOW_FIRMWARE_DUE,
} from './constants';

class MaslowLineParserResultVersion {
    static parse(line) {
        const payload = MaslowLineParserResultVersion.parseGrbl(line) ||
                        MaslowLineParserResultVersion.parseMaslowClassic(line);
        if (!payload) {
            return null;
        }
        return {
            type: MaslowLineParserResultVersion,
            payload: payload
        };
    }

    static parseGrbl(line) {
        const r = line.match(/^\[(?:VER:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const parts = _trim(r[1], ' :.').split('.'),
            numParts = parts.length;
        if (numParts < 2) {
            return null;
        }

        return {
            name: parts[numParts - 1] === 'MazDue' ? MASLOW_FIRMWARE_DUE : parts[numParts - 1],
            version: parts[numParts - 2],
        };
    }

    static parseMaslowClassic(line) {
        const r = line.match(/^Firmware Version (.+)$/);
        return r && {
            name: MASLOW_FIRMWARE_CLASSIC,
            version: r[1],
        };
    }
}

export default MaslowLineParserResultVersion;
