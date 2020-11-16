import GrblLineParserResultVersion from '../Grbl/GrblLineParserResultVersion';
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

        const ret = GrblLineParserResultVersion.parseVersion(r[1]);

        if (ret.name === 'MazDue') {
            // Legacy firmware name.
            ret.name = MASLOW_FIRMWARE_DUE;
        }

        return ret;
    }

    static parseMaslowClassic(line) {
        const fw = line.match(/^Firmware Version (.+)$/);
        const pcb = line.match(/^PCB v(.+) Detected$/);
        // Look for other lines indicative of the Maslow Classic
        const mc = line.indexOf('FAKE_SERVO ') >= 0 || line.indexOf('[Forward Calculating Position]') >= 0;
        if (!fw && !pcb && !mc) {
            return null;
        }
        const ret = {
            name: MASLOW_FIRMWARE_CLASSIC,
        };
        if (fw) {
            ret.version = fw[1];
        }
        if (pcb) {
            ret.edition = pcb[1];
        }
        return ret;
    }
}

export default MaslowLineParserResultVersion;
