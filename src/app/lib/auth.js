import api, { authrequest } from 'app/api';
import config from 'app/store';
import { createUserManager, loadUser } from 'redux-oidc';
import Workspaces from 'app/lib/workspaces';
import log from 'app/lib/log';
import analytics from 'app/lib/analytics';
import series from 'app/lib/promise-series';
import promisify from 'app/lib/promisify';

// Makerverse OAuth login mechanism.
// The oidc-client handles token hand-off and validation.

const devServer = false;
const authority = devServer ? 'http://localhost:5000' : 'https://openwork.shop';
const self = window.location.origin;
const oauthConfig = {
    client_id: 'Makerverse',
    redirect_uri: `${self}/#/callback`,
    post_logout_redirect_uri: `${self}/#/login`,
    response_type: 'code',
    scope: 'OpenWorkShopAPI openid profile',
    authority: `${authority}/`,
    silent_redirect_uri: `${self}/silent_renew.html`,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
    monitorSession: false,
};
const authManager = createUserManager(oauthConfig);

let _authenticated = false;

const resume = (reduxStore) => new Promise((resolve, reject) => {
    loadUser(reduxStore, auth.manager).then(signin).then(({ success }) => {
        resolve(success);
    });
});

const signin = (oidc) => new Promise((resolve, reject) => {
    const token = oidc ? oidc.access_token : config.get('session.token');
    if (!token) {
        log.debug('no token in storage');
        resolve({ success: false });
        return;
    }
    log.debug('resuming login...');
    authrequest
        .post('/api/signin')
        .send({ token })
        .then((res) => {
            const body = res ? res.body : {};

            if (!body.enabled || !body.user) {
                throw new Error(body.error ?? 'Login failed');
            } else {
                config.set('session.token', token);
                auth.user = body.user;
                log.debug('login successful for', auth.user.username);
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
                    log.debug(`loading workspace: ${record.name}`);
                    Workspaces.load(record);
                });
            } else {
                log.error('workspaces load error');
            }
            log.debug('login connecting to', Workspaces.all.length, 'workspaces...');
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
            resolve({ success: false, error: e });
        });
});

const signout = () => new Promise((resolve, reject) => {
    config.unset('session.token');
    auth.socket = {};
    authManager.signoutRedirect();
    _authenticated = false;
    resolve();
});

const isAuthenticated = () => {
    return _authenticated;
};

const auth = {
    host: '',
    socket: { },
    isAuthenticated: isAuthenticated,
    manager: authManager,
    signout: signout,
    signin: signin,
    resume: resume,
    user: null,
};

export default auth;
