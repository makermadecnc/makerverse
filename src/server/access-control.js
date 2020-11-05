import { getUserByToken, isGuestAccessEnabled, guestUser } from './api/api.users';
import settings from './config/settings';
import urljoin from './lib/urljoin';
import logger from './lib/logger';
import {
    ERR_FORBIDDEN
} from './constants';

const log = logger('access');

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
