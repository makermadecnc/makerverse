import api, { authrequest } from 'app/api';
import config from 'app/store';
import Workspaces from 'app/lib/workspaces';
import log from 'app/lib/log';
import owsCore from '@openworkshop/lib/OpenWorkShopCore';
import analytics from 'app/lib/analytics';
import { getCookie } from 'app/lib/cookies';
import series from 'app/lib/promise-series';
import promisify from 'app/lib/promisify';

// Makerverse OAuth login mechanism.
// The oidc-client handles token hand-off and validation.

const self = window.location.origin;

let _authenticated = false;

const resume = (reduxStore) => new Promise((resolve, reject) => {
    signin(owsCore.user).then(({ success }) => {
        resolve(success);
    });
});

const guest = () => new Promise((resolve, reject) => {
    authrequest
        .post('/api/signin')
        .then((res) => {
            resolve(res.body && res.body.guest);
        })
        .catch((e) => {
            log.error('login error', e);
        });
});

const signin = (oidc, guest = false) => new Promise((resolve, reject) => {
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
        .post('/api/signin')
        .send(payload)
        .then((res) => {
            const body = res ? res.body : {};

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
                                'Authorization': `Bearer ${token}`,
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
            if (body && body.records) {
                body.records.forEach((record) => {
                    Workspaces.load(record);
                });
            } else {
                log.error('workspaces load error');
            }
            log.debug('login connecting to workspaces:', Object.keys(Workspaces.all));
            const funcs = Object.keys(Workspaces.all).map((id) => {
                return () => promisify(next => {
                    const workspace = Workspaces.all[id];
                    workspace.controller.connect(auth.host, auth.socket, () => {
                        // @see "src/web/containers/Login/Login.jsx"
                        next();
                    });
                })();
            });
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

const signout = () => new Promise((resolve, reject) => {
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
    socket: { },
    isAuthenticated: isAuthenticated,
    setAuthenticated: setAuthenticated,
    hasGuestCookie: hasGuestCookie,
    client: {
        client_id: 'Makerverse',
        redirect_uri: `${self}/#/callback`,
        post_logout_redirect_uri: `${self}/#/login`,
        response_type: 'code',
        scope: 'OpenWorkShopAPI openid profile',
        silent_redirect_uri: `${self}/silent_renew.html`,
        automaticSilentRenew: true,
        filterProtocolClaims: true,
        AccessTokenLifetime: (60 * 60 * 24 * 30), // 30 days
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
