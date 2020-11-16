import _ from 'lodash';
import MaslowLineParserResultStatus from './MaslowLineParserResultStatus';
import MaslowLineParserResultOk from './MaslowLineParserResultOk';
import MaslowLineParserResultError from './MaslowLineParserResultError';
import MaslowLineParserResultAlarm from './MaslowLineParserResultAlarm';
import MaslowLineParserResultParserState from './MaslowLineParserResultParserState';
import MaslowLineParserResultParameters from './MaslowLineParserResultParameters';
import MaslowLineParserResultHelp from './MaslowLineParserResultHelp';
import MaslowLineParserResultVersion from './MaslowLineParserResultVersion';
import MaslowLineParserResultOption from './MaslowLineParserResultOption';
import MaslowLineParserResultEcho from './MaslowLineParserResultEcho';
import MaslowLineParserResultFeedback from './MaslowLineParserResultFeedback';
import MaslowLineParserResultSettings from './MaslowLineParserResultSettings';
import MaslowLineParserResultStartup from './MaslowLineParserResultStartup';
import MaslowLineParserResultPositionalError from './MaslowLineParserResultPositionalError';

// Maslow v1.1
// https://github.com/gnea/grbl/blob/edge/doc/markdown/interface.md

class MaslowLineParser {
    parse(line) {
        const parsers = [
            // <>
            MaslowLineParserResultStatus,

            // ok
            MaslowLineParserResultOk,

            // error:x
            MaslowLineParserResultError,

            // ALARM:
            MaslowLineParserResultAlarm,

            // [G38.2 G54 G17 G21 G91 G94 M0 M5 M9 T0 F20. S0.] (v0.9)
            // [GC:G38.2 G54 G17 G21 G91 G94 M0 M5 M9 T0 F20. S0.] (v1.1)
            MaslowLineParserResultParserState,

            // [G54:0.000,0.000,0.000]
            // [G55:0.000,0.000,0.000]
            // [G56:0.000,0.000,0.000]
            // [G57:0.000,0.000,0.000]
            // [G58:0.000,0.000,0.000]
            // [G59:0.000,0.000,0.000]
            // [G28:0.000,0.000,0.000]
            // [G30:0.000,0.000,0.000]
            // [G92:0.000,0.000,0.000]
            // [TLO:0.000]
            // [PRB:0.000,0.000,0.000:0]
            MaslowLineParserResultParameters,

            // [HLP:] (v1.1)
            MaslowLineParserResultHelp,

            // [VER:] (v1.1)
            MaslowLineParserResultVersion,

            // [OPT:] (v1.1)
            MaslowLineParserResultOption,

            // [echo:] (v1.1)
            MaslowLineParserResultEcho,

            // [PE:0.00,0.00,127,1761.40,1765.29]
            MaslowLineParserResultPositionalError,

            // [] (v0.9)
            // [MSG:] (v1.1)
            MaslowLineParserResultFeedback,

            // $xx
            MaslowLineParserResultSettings,

            // Maslow X.Xx ['$' for help]
            MaslowLineParserResultStartup,

        ];

        for (let parser of parsers) {
            const result = parser.parse(line);
            if (result) {
                _.set(result, 'payload.raw', line);
                return result;
            }
        }

        return {
            type: null,
            payload: {
                raw: line
            }
        };
    }
}

export default MaslowLineParser;
