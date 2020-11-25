import { IOpenWorkShop } from '@openworkshop/lib';
import _ from 'lodash';
import ReactGA from 'react-ga';
import settings from 'config/settings';
import { ISemver } from './semvers';
import { Logger } from '@openworkshop/lib/utils/logging/Logger';

let log: Logger | undefined = undefined;

// Common names for dimensions
const DIMENSION_MAP: { [key: string]: number } = {
  // page: 1,
  version: 2,
  build: 3,
  // hostname: 4,
  // protocol: 5,
  firmwareName: 6,
  firmwareVersion: 7,
  protocolName: 8,
  protocolVersion: 9,
  controllerType: 10,
};

interface IFunc {
  name: string;
}

// When in development mode, analytics go into the console and not to the server.
function wrapDev<TFunc extends IFunc>(func: TFunc) {
  const version: ISemver = settings.version;
  if (version.branch === 'dev') {
    return (...args: unknown[]) => {
      log?.trace(func.name, args);
    };
  }
  return func;
}

const pageview = wrapDev(ReactGA.pageview);
const set = wrapDev(ReactGA.set);

const setDimensions = (opts: { [key: string]: string }): void => {
  Object.keys(DIMENSION_MAP).forEach((d) => {
    if (_.has(opts, d)) {
      const dNum = DIMENSION_MAP[d];
      opts[`dimension${dNum}`] = opts[d];
      delete opts[d];
    }
  });
  set(opts);
};

const trackPage = (path: string): void => {
  setDimensions({
    version: settings.version.public,
    build: settings.version.build.toString(),
  });
  pageview(path);
};

const analytics = {
  initialize: (ows: IOpenWorkShop): void => {
    log = ows.logManager.getLogger('analytics');
    // https://github.com/ReactTraining/react-router/issues/4278#issuecomment-299692502
    ReactGA.initialize(settings.analytics.trackingId, {
      gaOptions: {
        cookieDomain: 'none',
      },
    });
  },
  modalview: wrapDev(ReactGA.modalview),
  // pageview: wrapDev(ReactGA.pageview),
  trackPage: trackPage,
  event: wrapDev(ReactGA.event),
  exception: wrapDev(ReactGA.event),
  set: setDimensions,
  OutboundLink: ReactGA.OutboundLink,
};

export default analytics;
