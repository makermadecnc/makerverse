/* eslint import/no-dynamic-require: 0 */
import chainedFunction from 'chained-function';
import moment from 'moment';
import pubsub from 'pubsub-js';
import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import {
    HashRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import i18next from 'i18next';
import { OidcProvider } from 'redux-oidc';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';
import { TRACE, DEBUG, INFO, WARN, ERROR } from 'universal-logger';
import { Provider as GridSystemProvider } from 'app/components/GridSystem';
import settings from './config/settings';
import portal from './lib/portal';
import i18n from './lib/i18n';
import log from './lib/log';
import series from './lib/promise-series';
import promisify from './lib/promisify';
import auth from './lib/auth';
import store from './store';
import configureReduxStore from './store/redux';
import App from './containers/App';
import Login from './containers/Login';
import Callback from './containers/Login/Callback';
import Anchor from './components/Anchor';
import { Button } from './components/Buttons';
import ModalTemplate from './components/ModalTemplate';
import Modal from './components/Modal';
import ProtectedRoute from './components/ProtectedRoute';
import Space from './components/Space';
import './styles/vendor.styl';
import './styles/app.styl';

const baseUrl = window.location.host;
const history = createBrowserHistory({ basename: baseUrl });
const reduxStore = configureReduxStore(history);

const renderPage = () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    ReactDOM.render(
        <Provider store={reduxStore}>
            <OidcProvider store={reduxStore} userManager={auth.manager}>
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
            </OidcProvider>
        </Provider>,
        container
    );
};

series([
    () => {
        const obj = qs.parse(window.location.search.slice(1));
        const level = {
            trace: TRACE,
            debug: DEBUG,
            info: INFO,
            warn: WARN,
            error: ERROR
        }[obj.log_level || settings.log.level];
        log.setLevel(level);
    },
    () => promisify(next => {
        i18next
            .use(XHR)
            .use(LanguageDetector)
            .init(settings.i18next, (t) => {
                next();
            });
    })(),
    () => promisify(next => {
        const locale = i18next.language;
        if (locale === 'en') {
            next();
            return;
        }

        require('bundle-loader!moment/locale/' + locale)(() => {
            log.debug(`moment: locale=${locale}`);
            moment().locale(locale);
            next();
        });
    })(),
    () => auth.resume(reduxStore),
]).then(async () => {
    log.info(`${settings.productName}`);

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

    { // Hide loading
        const loading = document.getElementById('loading');
        loading && loading.remove();
    }

    { // Change backgrond color after loading complete
        const body = document.querySelector('body');
        body.style.backgroundColor = '#222'; // sidebar background color
    }

    if (settings.error.corruptedWorkspaceSettings) {
        const text = store.getConfig();
        const url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
        const filename = `${settings.name}-${settings.version.full}.json`;

        await portal(({ onClose }) => (
            <Modal
                onClose={onClose}
                disableOverlay={true}
                showCloseButton={false}
            >
                <Modal.Body>
                    <ModalTemplate type="error">
                        <h5>{i18n._('Corrupted workspace settings')}</h5>
                        <p>{i18n._('The workspace settings have become corrupted or invalid. Click Restore Defaults to restore default settings and continue.')}</p>
                        <div>
                            <Anchor
                                href={url}
                                download={filename}
                            >
                                <i className="fa fa-download" />
                                <Space width="4" />
                                {i18n._('Download workspace settings')}
                            </Anchor>
                        </div>
                    </ModalTemplate>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        btnStyle="danger"
                        onClick={chainedFunction(
                            store.resetDefaults,
                            onClose
                        )}
                    >
                        {i18n._('Restore Defaults')}
                    </Button>
                </Modal.Footer>
            </Modal>
        ));
    }

    renderPage();
}).catch(err => {
    log.error(err);
});
