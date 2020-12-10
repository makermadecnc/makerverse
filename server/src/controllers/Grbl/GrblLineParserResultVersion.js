class GrblLineParserResultVersion {
    // SainSmart / standard Grbl: "1.1f.20170801:LASER"
    // Maslow / etc.: "1.1g.20200909.MaslowDue:""
    // Carvey: [VER:2.0.0.20170522::CTRL0] => 2.0.0.20170522:CARVEY:R13:969-9510604:CTRL0
    static parseVersion(ver) {
        const p = ver.split(':');
        const ret = {};
        ret.id = p.length > 1 ? p[1] : ''; // "LASER"
        const v = p[0].split('.'); // ["1", "1f", 20170801] ... ["1", "1g", "20200909", "MaslowDue"]
        if (v.length < 2) {
            ret.name = p[0]; // ????
        } else {
            ret.name = v.length > 3 ? v.slice(3).join('.') : 'Grbl'; // "MaslowDue" / "Grbl"
            ret.edition = `${v[0]}.${v[1]}`; // "1.1g" / "1.1f"
            ret.version = v.length > 2 ? v[2] : null;
        }
        return ret;
    }

    static parse(line) {
        // * Grbl v1.1
        //   [VER:]
        const r = line.match(/^\[(?:VER:)(.+)\]$/);
        if (!r) {
            return null;
        }

        const payload = this.parseVersion(r[1]);

        return {
            type: GrblLineParserResultVersion,
            payload: payload
        };
    }
}

export default GrblLineParserResultVersion;
