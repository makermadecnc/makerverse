import { CssBaseline } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from '@apollo/client/link/ws';
import log from 'js-logger';
import { OpenWorkShopProvider } from '@openworkshop/ui/components';
import configureStore from 'store/redux';
import { initReactI18next } from 'react-i18next';
import { ThemeProvider } from '@material-ui/core';
import theme from '@openworkshop/ui/themes/Makerverse';
import MakerverseProvider from './views/MakerverseProvider';
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

const apolloLink = new WebSocketLink(new SubscriptionClient('ws://localhost:8000/api/graphql', {
  reconnect: true
}));

ReactDOM.render(
  <Provider store={store}>
    <OpenWorkShopProvider
      store={store}
      client={auth.client}
      hostnameMap={auth.hosts}
      i18nMiddleware={[initReactI18next]}
      clientApolloLink={apolloLink}
    >
        <ThemeProvider theme={theme}>
          <Router >
            <CssBaseline />
            <MakerverseProvider />
          </Router>
        </ThemeProvider>
    </OpenWorkShopProvider>
  </Provider>,
  container,
);
