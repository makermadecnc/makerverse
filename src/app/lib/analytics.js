import _ from 'lodash';
import ReactGA from 'react-ga';
import settings from 'app/config/settings';
import log from 'app/lib/log';

// https://github.com/ReactTraining/react-router/issues/4278#issuecomment-299692502
ReactGA.initialize(settings.analytics.trackingId, {
    gaOptions: {
        cookieDomain: 'none'
    }
});

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

const analytics = {
    modalview: wrapDev(ReactGA.modalview),
    pageview: wrapDev(ReactGA.pageview),
    event: wrapDev(ReactGA.event),
    exception: wrapDev(ReactGA.event),
    set: wrapDev(ReactGA.set),
    OutboundLink: ReactGA.OutboundLink,
};

export const trackPage = (location) => {
    analytics.set({
        version: settings.version.public,
        build: settings.version.build,
        hostname: location.hostname,
        protocol: location.protocol,
    });
    analytics.pageview(location.pathname);
};

export default analytics;
