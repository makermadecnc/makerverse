import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import log from 'js-logger';
import { OpenWorkShopProvider } from '@openworkshop/ui/components';
import configureStore from 'store/redux';
import { initReactI18next } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core';
import {IOpenWorkShop} from '@openworkshop/lib';
import usePromise from 'react-promise-suspense';
import theme from '@openworkshop/ui/themes/Makerverse';
import {MakerverseSubscription} from "./lib/Makerverse/apollo";
import MakerverseProvider, { IMakerverseConfig } from './views/MakerverseProvider';
import auth from './lib/auth';
import './styles/vendor.styl';
import './styles/app.styl';

// Create browser history to use in the Redux store
// const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
// const history = createBrowserHistory(); // { basename: baseUrl })

const store = configureStore();

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

// function addListeners() {
//   // Cross-origin communication
//   window.addEventListener(
//     'message',
//     (event) => {
//       // TODO: event.origin
//
//       const { token = '', action } = { ...event.data };
//
//       // Token authentication
//       if (token !== internalStore.get('session.token')) {
//         // log.warn(`Received a message with an unauthorized token (${token}).`);
//         return;
//       }
//
//       const { type, payload } = { ...action };
//       if (type === 'connect') {
//         pubsub.publish('message:connect', payload);
//       } else if (type === 'resize') {
//         pubsub.publish('message:resize', payload);
//       } else {
//         log.warn(`No valid action type (${type}) specified in the message.`);
//       }
//     },
//     false,
//   );
//
//   {
//     // Prevent browser from loading a drag-and-dropped file
//     // @see http://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
//     window.addEventListener(
//       'dragover',
//       (e) => {
//         e.preventDefault();
//       },
//       false,
//     );
//
//     window.addEventListener(
//       'drop',
//       (e) => {
//         e.preventDefault();
//       },
//       false,
//     );
//   }
// }

const container = document.createElement('div');
document.body.appendChild(container);

log.debug('startup', window.location);

const config = {
  connection: undefined,
};

function apolloLinkCreator(ows) {
  config.connection = new MakerverseSubscription(ows);
  return config.connection.webSocketLink;
}

const MakerverseMain = () => {
  usePromise(async () => {
    while(!config.connection) {
      await new Promise((r) => setTimeout(r, 100));
    }
  }, [config]);

  return (
    <ThemeProvider theme={theme}>
      <Router >
        <CssBaseline />
        <MakerverseProvider connection={config.connection} />
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Provider store={store}>
    <OpenWorkShopProvider
      store={store}
      client={auth.client}
      hostnameMap={auth.hosts}
      i18nMiddleware={[initReactI18next]}
      clientApolloLinkCreator={apolloLinkCreator}
    >
        <MakerverseMain />
    </OpenWorkShopProvider>
  </Provider>,
  container,
);
