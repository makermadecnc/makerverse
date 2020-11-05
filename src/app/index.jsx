/* eslint import/no-dynamic-require: 0 */
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import moment from 'moment';
import pubsub from 'pubsub-js';
import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import usePromise from 'react-promise-suspense';
import { OpenWorkShopProvider } from '@openworkshop/ui/components';
import { configureStore } from '@openworkshop/lib/store';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import { Provider as GridSystemProvider } from './components/GridSystem';
import ProtectedRoute from './components/ProtectedRoute';
import settings from './config/settings';
import App from './containers/App';
import Login from './containers/Login';
import Callback from './containers/Login/Callback';
import log from './lib/log';
import auth from './lib/auth';
import store from './store';
import './styles/vendor.styl';
import './styles/app.styl';

const reduxStore = configureStore();

function getLogLevel() {
    const obj = qs.parse(window.location.search.slice(1));
    return {
        trace: TRACE,
        debug: DEBUG,
        info: INFO,
        warn: WARN,
        error: ERROR
    }[obj.log_level || settings.log.level];
}

function addListeners() {
    // Cross-origin communication
    window.addEventListener('message', (event) => {
        // TODO: event.origin

        const { token = '', action } = { ...event.data };

        // Token authentication
        if (token !== store.get('session.token')) {
            // log.warn(`Received a message with an unauthorized token (${token}).`);
            return;
        }

        const { type, payload } = { ...action };
        if (type === 'connect') {
            pubsub.publish('message:connect', payload);
        } else if (type === 'resize') {
            pubsub.publish('message:resize', payload);
        } else {
            log.warn(`No valid action type (${type}) specified in the message.`);
        }
    }, false);

    { // Prevent browser from loading a drag-and-dropped file
        // @see http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
        window.addEventListener('dragover', (e) => {
            e.preventDefault();
        }, false);

        window.addEventListener('drop', (e) => {
            e.preventDefault();
        }, false);
    }
}

// series([
//     () => {
//     },
//     () => promisify(next => {
//     })(),
//     () => promisify(next => {
//     })(),
//     // () => auth.resume(reduxStore),
// ]).then(async () => {
//     log.info(`${settings.productName}`);
//     addListeners();
//
//     { // Hide loading
//         const loading = document.getElementById('loading');
//         loading && loading.remove();
//     }
//
//     { // Change backgrond color after loading complete
//         const body = document.querySelector('body');
//         body.style.backgroundColor = '#222'; // sidebar background color
//     }
//
//     // if (true || settings.error.corruptedWorkspaceSettings) {
//     // }
//
//     renderPage();
// }).catch(err => {
//     log.error(err);
// });

const LoadedApp = () => {
    usePromise(async() => {
        log.setLevel(getLogLevel());

        await i18next
            .use(XHR)
            .use(LanguageDetector)
            .init(settings.i18next);

        const locale = i18next.language;
        if (locale !== 'en') {
            require('bundle-loader!moment/locale/' + locale)(() => {
                log.debug(`moment: locale=${locale}`);
                moment().locale(locale);
            });
            return;
        }

        await auth.resume();

        addListeners();
    }, []);

    return (
        <GridSystemProvider
            breakpoints={[576, 768, 992, 1200]}
            containerWidths={[540, 720, 960, 1140]}
            columns={12}
            gutterWidth={0}
            layout="floats"
        >
            <Router>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/callback" component={Callback} />
                    <ProtectedRoute path="/" component={App} />
                </Switch>
            </Router>
        </GridSystemProvider>
    );
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.render(
    <Provider store={reduxStore}>
        <OpenWorkShopProvider
            store={reduxStore}
            client={auth.client}
            hostnameMap={auth.hosts}
            i18nMiddleware={initReactI18next}
        >
            <LoadedApp />
        </OpenWorkShopProvider>
    </Provider>,
    container
);
