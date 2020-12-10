import semver from 'semver';

export interface ISemver {
  major: number;
  minor: number;
  patch: number;
  branch: string | null;
  build: string | number;
  full: string;
  public: string;
  readable: string;
}

function parseSemver(v: string): ISemver {
  if (!semver.valid(v)) {
    return parseSemver('0.0.0-corrupted.0');
  }
  const prerelease = semver.prerelease(v) || [];
  const maj = semver.major(v);
  const min = semver.minor(v);
  const pat = semver.patch(v);
  const pub = `${maj}.${min}.${pat}`;
  const branch = prerelease[0] !== 'master' ? prerelease[0] : null;
  const build = prerelease[1] || 0;

  let readable = pub;
  if (branch) {
    readable += ` [${branch}]`;
  }
  if (build) {
    readable += ` #${build}`;
  }
  return {
    major: maj,
    minor: min,
    patch: pat,
    branch: branch,
    build: build,
    full: v, // The full version string
    public: pub, // The public, easy to read string
    readable: readable, // long, human readable full version string
  };
}

export { parseSemver };
