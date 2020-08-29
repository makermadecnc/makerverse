import semver from 'semver';

const parseSemver = (v) => {
    if (!semver.valid(v)) {
        return parseSemver('0.0.0-corrupted.0');
    }
    const prerelease = semver.prerelease(v) || [];
    const maj = semver.major(v);
    const min = semver.minor(v);
    const pat = semver.patch(v);
    const pub = `${maj}.${min}.${pat}`;
    let readable = pub;
    if (prerelease[0] && prerelease[0] !== 'master') {
        readable += ` [${prerelease[0]}]`;
    }
    if (prerelease[1]) {
        readable += ` #${prerelease[1]}`;
    }
    return {
        major: maj,
        minor: min,
        patch: pat,
        branch: prerelease[0],
        build: prerelease[1],
        full: v, // The full version string
        public: pub, // The public, easy to read string
        readable: readable, // long, human readable full version string
    };
};

export { parseSemver };
