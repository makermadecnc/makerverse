import _ from 'lodash';
import log from 'js-logger';
import ReactGA from 'react-ga';
import settings from 'config/settings';

// https://github.com/ReactTraining/react-router/issues/4278#issuecomment-299692502
ReactGA.initialize(settings.analytics.trackingId, {
    gaOptions: {
        cookieDomain: 'none'
    }
});

// Common names for dimensions
const DIMENSION_MAP = {
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

// When in development mode, analytics go into the console and not to the server.
const wrapDev = (func) => {
    const branch = _.get(settings, 'version.branch');
    if (branch === 'dev') {
        return (args) => {
            log.debug('analytcs', func.name, args);
        };
    }
    return func;
};

const pageview = wrapDev(ReactGA.pageview);
const set = wrapDev(ReactGA.set);

const setDimensions = (opts) => {
    Object.keys(DIMENSION_MAP).forEach((d) => {
        if (_.has(opts, d)) {
            const dNum = DIMENSION_MAP[d];
            opts[`dimension${dNum}`] = opts[d];
            delete opts[d];
        }
    });
    set(opts);
};

const trackPage = (location, workspace) => {
    setDimensions({
        version: settings.version.public,
        build: settings.version.build,
    });
    const path = workspace ? workspace.hardware.path : location.pathname;
    pageview(path);
};

const analytics = {
    modalview: wrapDev(ReactGA.modalview),
    // pageview: wrapDev(ReactGA.pageview),
    trackPage: trackPage,
    event: wrapDev(ReactGA.event),
    exception: wrapDev(ReactGA.event),
    set: setDimensions,
    OutboundLink: ReactGA.OutboundLink,
};

export default analytics;
