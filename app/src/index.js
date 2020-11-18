import pubsub from 'pubsub-js';
import { CssBaseline } from '@material-ui/core';
import OpenWorkShopContext from '@openworkshop/lib/OpenWorkShopContext';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import i18next from 'i18next';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import log from 'js-logger';
import usePromise from 'react-promise-suspense';
import { OpenWorkShopProvider } from '@openworkshop/ui/components';
import configureStore from 'store/redux';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import { setOwsSettings } from './lib/ows/settings';
import Routes from './containers/Routes';
import settings from './config/settings';
import i18nConfig from './config/i18n';
import AppCorrupted from './containers/AppCorrupted';
import auth from './lib/auth';
import internalStore from './store';
import './styles/vendor.styl';
import './styles/app.styl';

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const history = createBrowserHistory({ basename: baseUrl });

const store = configureStore(history);

//
// function getLogLevel() {
//     const obj = qs.parse(window.location.search.slice(1));
//     return {
//         trace: TRACE,
//         debug: DEBUG,
//         info: INFO,
//         warn: WARN,
//         error: ERROR
//     }[obj.log_level || settings.log.level];
// }

function addListeners() {
  // Cross-origin communication
  window.addEventListener(
    'message',
    (event) => {
      // TODO: event.origin

      const { token = '', action } = { ...event.data };

      // Token authentication
      if (token !== internalStore.get('session.token')) {
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
    },
    false,
  );

  {
    // Prevent browser from loading a drag-and-dropped file
    // @see http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
    window.addEventListener(
      'dragover',
      (e) => {
        e.preventDefault();
      },
      false,
    );

    window.addEventListener(
      'drop',
      (e) => {
        e.preventDefault();
      },
      false,
    );
  }
}

const LoadedRoutes = () => {
  const owsCore = React.useContext(OpenWorkShopContext);

  usePromise(async () => {
    log.debug('loading...', history);
    // log.setLevel(getLogLevel());
    //
    await i18next.use(XHR).use(LanguageDetector).init(i18nConfig);

    // const locale = i18next.language;
    // if (locale !== 'en') {
    //     require('bundle-loader!moment/locale/' + locale)(() => {
    //         log.debug(`moment: locale=${locale}`);
    //         moment().locale(locale);
    //     });
    //     return;
    // }

    setOwsSettings(owsCore.settings);
    await auth.resume(owsCore);

    addListeners();
  }, []);

  if (settings.error.corruptedWorkspaceSettings) {
    return <AppCorrupted />;
  }

  return <Routes />;
};

const container = document.createElement('div');
document.body.appendChild(container);

log.debug('startup');

ReactDOM.render(
  <Provider store={store}>
    <OpenWorkShopProvider
      store={store}
      client={auth.client}
      hostnameMap={auth.hosts}
      i18nMiddleware={[initReactI18next]}>
      <Router history={history}>
        <CssBaseline />
        <LoadedRoutes />
      </Router>
    </OpenWorkShopProvider>
  </Provider>,
  container,
);
