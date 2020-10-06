import { apirequest } from 'app/api';
import config from 'app/store';
import { createUserManager } from 'redux-oidc';
import log from 'app/lib/log';

// Makerverse OAuth login mechanism.
// The oidc-client handles token hand-off and validation.

const devServer = true;
const authority = devServer ? 'http://localhost:5000' : 'https://openwork.shop';
const self = 'http://localhost:8000';
const oauthConfig = {
    client_id: 'Makerverse',
    redirect_uri: `${self}/#/account/logged-in`,
    post_logout_redirect_uri: `${self}/#/account/logged-out`,
    response_type: 'code',
    scope: 'OpenWorkShopAPI openid profile',
    authority: `${authority}/`,
    silent_redirect_uri: `${self}/silent_renew.html`,
    automaticSilentRenew: true,
    filterProtocolClaims: true,
    loadUserInfo: true,
    monitorSession: false,
};
export const authManager = createUserManager(oauthConfig);

export const userProfile = {
    user: null,
};

let _authenticated = false;

export const getReturnUrl = () => new Promise((resolve, reject) => {
    authManager
        .createSigninRequest()
        .then((p) => {
            resolve(p.url);
        });
    // resolve(`${self}/logged-in`);
});

export const call = (path, args) => new Promise((resolve, reject) => {
    getReturnUrl()
        .then((url) => {
            args.returnUrl = url;
            log.debug(path, 'request', url);
            return apirequest.post(`${authority}/api/auth/${path}`).send(args); // withCredentials().
        })
        .then((res) => {
            log.debug(path, 'response: ', res.body);
            if (!res.body.record) {
                throw new Error('Response was missing data');
            } else if (res.body.meta && res.body.meta.redirectUrl) {
                window.location.replace(res.body.meta.redirectUrl);
            } else {
                resolve({ success: true });
            }
        })
        .catch((err) => {
            let body = err.response ? err.response.body : {};
            log.error(path, 'error:', err.message, body);
            resolve({ success: false, errors: body.errors || [err.message] });
        });
});

export const signin = (args) => call('login', args);

export const signup = (args) => call('register', args);

export const resend = (args) => call('send/email', args);

export const signout = () => new Promise((resolve, reject) => {
    config.unset('session.token');
    _authenticated = false;
    resolve();
});

export const isAuthenticated = () => {
    return _authenticated;
};
