import { parseSemver } from 'lib/semvers';
import pkg from '../../package.json';

const webroot = '/';

const settings = {
  error: {
    // The flag is set to true if the workspace settings have become corrupted or invalid.
    // @see store/index.js
    corruptedWorkspaceSettings: false,
  },
  workspaces: [],
  name: pkg.name,
  productName: pkg.productName,
  version: parseSemver(pkg.version),
  webroot: webroot,
  log: {
    level: 'debug', // trace, debug, info, warn, error
  },
  analytics: {
    trackingId: '3920215-30',
  },
};

export default settings;
