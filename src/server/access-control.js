// import ensureArray from 'ensure-array';
// import _ from 'lodash';
// import rangeCheck from 'range_check';
import { getUserByToken, isGuestAccessEnabled, guestUser } from './api/api.users';
import settings from './config/settings';
// import config from './services/configstore';
import urljoin from './lib/urljoin';
import logger from './lib/logger';
import {
    ERR_FORBIDDEN
} from './constants';

const log = logger('access');

// const localIpAddresses = [
//     // IPv4 reserved space
//     '127.0.0.0/8', // Used for loopback addresses to the local host
//     '10.0.0.0/8', // Used for local communications within a private network
//     '172.16.0.0/12', // Used for local communications within a private network
//     '192.168.0.0/16', // Used for local communications within a private network
//     '169.254.0.0/16', // Link-local address

//     // IPv4 mapped IPv6 address
//     '::ffff:10.0.0.0/8',
//     '::ffff:127.0.0.0/8',
//     '::ffff:172.16.0.0/12',
//     '::ffff:192.168.0.0/16',

//     // IPv6 reserved space
//     '::1/128', // loopback address to the local host
//     'fc00::/7', // Unique local address
//     'fe80::/10' // Link-local address
// ];

// export const authorizeIPAddress = (ipaddr) => new Promise((resolve, reject) => {
//     let pass = !!(settings.allowRemoteAccess);
//     pass = pass || localIpAddresses.some(test => rangeCheck.inRange(ipaddr, test));

//     if (pass) {
//         resolve();
//     } else {
//         reject(new Error(`Unauthorized IP address: ipaddr=${ipaddr}`));
//     }
// });

// export const validateUser = (user) => new Promise((resolve, reject) => {
//     if (!user) {
//         reject(new Error('User not found'));
//     }
//     const { id = null, name = null } = { ...user };

//     const users = ensureArray(config.get('users'))
//         .filter(user => _.isPlainObject(user))
//         .map(user => ({
//             ...user,
//             // Defaults to true if not explicitly initialized
//             enabled: (user.enabled !== false)
//         }));
//     const enabledUsers = users.filter(user => user.enabled);

//     if ((enabledUsers.length === 0) || _.find(enabledUsers, { id: id, name: name })) {
//         resolve();
//     } else {
//         reject(new Error(`Unauthorized user: user.username=${name}`));
//     }
// });

// "Bearer xyz" => xyz
const getTokenFromHeader = (authHeader) => {
    if (!authHeader) {
        return null;
    }
    const authHeaderParts = authHeader.split(' ');
    const hasBearer = authHeaderParts.length === 2 && authHeaderParts[0].toLowerCase() === 'bearer';
    return hasBearer ? authHeaderParts[1] : null;
};

// Return the associated token for a user (or throw an error)
const validateToken = (token) => {
    if (!token || token.length <= 0) {
        if (isGuestAccessEnabled()) {
            return guestUser;
        } else {
            throw new Error('No token provided');
        }
    }
    const user = getUserByToken(token);
    if (!user) {
        throw new Error('No user found for token');
    }
    if (!user.enabled) {
        throw new Error('The user is not enabled');
    }
    return user;
};

const doesPathRequireAuth = (path) => {
    const apiRoute = urljoin(settings.route, 'api/');
    const signinRoute = urljoin(settings.route, 'api/signin');
    return path.indexOf(apiRoute) === 0 && path.indexOf(signinRoute) !== 0;
};

// Express middleware for authing a request
export const authExpressMiddleware = (req, res, next) => {
    if (!doesPathRequireAuth(req.path)) {
        // The React SPA does not require auth.
        next();
        return;
    }

    const token = getTokenFromHeader(req.headers.authorization);
    log.silly('auth api request', token);

    try {
        validateToken(token);
    } catch (err) {
        const ipaddr = req.ip || req.connection.remoteAddress;
        log.warn(`Forbidden: ipaddr=${ipaddr}, code="${err.code}", message="${err.message}"`);
        res.status(ERR_FORBIDDEN).end('Forbidden Access');
        return;
    }

    next();
};

export const authSocketIoMiddleware = (socket, next) => {
    const token = getTokenFromHeader(socket.request.headers.authorization);
    log.silly('auth socket request', token);

    try {
        socket.user = validateToken(token);
    } catch (err) {
        log.warn(err);
        next(err);
        return;
    }

    next();
};
