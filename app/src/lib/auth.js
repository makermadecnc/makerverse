import { getCookie } from 'lib/cookies';

// Makerverse OAuth login mechanism.
// The oidc-client handles token hand-off and validation.

const self = window.location.origin;

let _authenticated = false;

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
  isGuest: isGuest,
  guest: undefined,
  GUEST_COOKIE_NAME: GUEST_COOKIE_NAME,
  user: null,
};

export default auth;
