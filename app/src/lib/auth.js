import log from 'js-logger';
import api from 'api';
import authrequest from 'lib/ows/authrequest';
import config from 'store';
import analytics from 'lib/analytics';
import { getCookie } from 'lib/cookies';
import series from 'lib/promise-series';

// Makerverse OAuth login mechanism.
// The oidc-client handles token hand-off and validation.

const self = window.location.origin;

let _authenticated = false;

const resume = (makerverse) =>
  new Promise((resolve, reject) => {
    signin(makerverse, makerverse.ows.user).then(({ success }) => {
      resolve(success);
    });
  });

const guest = () =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/users/login')
      .then((res) => {
        resolve(res.body && res.body.guest);
      })
      .catch((e) => {
        log.error('login error', e);
      });
  });

const signin = (makerverse, oidc, guest = false) =>
  new Promise((resolve, reject) => {
    const token = oidc ? oidc.access_token : config.get('session.token');
    const isGuest = guest || hasGuestCookie();
    if (!token && !isGuest) {
      log.debug('no token in storage');
      resolve({ success: false });
      return;
    }
    const payload = isGuest ? {} : { token };
    log.debug('resuming login...');
    authrequest
      .post('/api/users/login')
      .send(payload)
      .then((res) => {
        const body = res && res.body ? res.body : {};
        console.log('body', body);

        if (!body.enabled || !body.user) {
          throw new Error(body.error ?? 'Login failed');
        } else {
          config.set('session.token', token);
          auth.user = body.user;
          log.debug('login successful for', auth.user.username);
          config.set('session.name', auth.user.username);
          config.set('session.enabled', true);
          auth.host = '';
          auth.socket = {
            transportOptions: {
              polling: {
                extraHeaders: {
                  Authorization: `Bearer ${token}`,
                },
              },
            },
          };
          analytics.set({
            userId: auth.user.username,
          });
          _authenticated = true;
        }
      })
      .then(() => {
        log.debug('login loading workspaces...');
        return api.workspaces.fetch();
      })
      .then(({ body }) => {
        if (body) {
          body.forEach((record) => {
            makerverse.workspaces.load(record);
          });
        } else {
          log.error('workspaces load error', body);
        }
        log.debug('login connecting to workspaces:', Object.keys(makerverse.workspaces.all));
        const funcs = []; /*Object.keys(Workspaces.all).map((id) => {
          return () =>
            promisify((next) => {
              const workspace = Workspaces.all[id];
              workspace.controller.connect(auth.host, auth.socket, () => {
                // @see "src/web/containers/Login/Login.jsx"
                next();
              });
            })();
        });*/
        log.warn('skipping connections');
        return series(funcs);
      })
      .then(() => {
        log.debug('login complete');
        resolve({ success: true });
      })
      .catch((e) => {
        log.error('login error', e);
        config.set('session.enabled', false);
        resolve({ success: false, error: e });
      });
  });

const signout = (owsCore) =>
  new Promise((resolve, reject) => {
    config.unset('session.token');
    config.set('session.enabled', false);
    auth.socket = {};
    owsCore.authManager.signoutRedirect();
    _authenticated = false;
    resolve();
  });

const GUEST_COOKIE_NAME = 'mvguest';

const hasGuestCookie = () => {
  return getCookie(GUEST_COOKIE_NAME) === '1';
};

const isAuthenticated = () => {
  return _authenticated || hasGuestCookie();
};

const setAuthenticated = (auth) => {
  _authenticated = !!auth;
};

const isGuest = () => {
  return isAuthenticated() && auth.user && auth.user.username === 'guest';
};

const auth = {
  host: '',
  socket: {},
  isAuthenticated: isAuthenticated,
  setAuthenticated: setAuthenticated,
  hasGuestCookie: hasGuestCookie,
  client: {
    client_id: 'Makerverse',
    redirect_uri: `${self}/callback`,
    post_logout_redirect_uri: `${self}/login`,
    response_type: 'code',
    scope: 'OpenWorkShopAPI openid profile',
    silent_redirect_uri: `${self}/silent_renew.html`,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    AccessTokenLifetime: 60 * 60 * 24 * 30, // 30 days
    loadUserInfo: true,
    monitorSession: false,
  },
  hosts: {
    'dev.makerverse': 'Development',
    'staging.makerverse': 'Staging',
  },
  signout: signout,
  signin: signin,
  resume: resume,
  isGuest: isGuest,
  guest: guest,
  GUEST_COOKIE_NAME: GUEST_COOKIE_NAME,
  user: null,
};

export default auth;
