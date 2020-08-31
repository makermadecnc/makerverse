import ReactGA from 'react-ga';
import settings from 'app/config/settings';

// https://github.com/ReactTraining/react-router/issues/4278#issuecomment-299692502
ReactGA.initialize(settings.analytics.trackingId, {
    gaOptions: {
        cookieDomain: 'none'
    }
});

export const trackPage = (location) => {
    ReactGA.set({
        page: location.pathname,
        version: settings.version.public,
        build: settings.version.build,
        hostname: location.hostname,
        protocol: location.protocol,
    });
    ReactGA.pageview(location.pathname);
};

export default ReactGA;
