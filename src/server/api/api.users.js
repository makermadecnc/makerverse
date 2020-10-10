// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt-nodejs';
import ensureArray from 'ensure-array';
import isPlainObject from 'lodash/isPlainObject';
import superagent from 'superagent';
import superagentUse from 'superagent-use';
import _ from 'lodash';
// import uuid from 'uuid';
import settings from '../config/settings';
import logger from '../lib/logger';
import config from '../services/configstore';
import { getPagingRange } from './paging';
import {
    // ERR_BAD_REQUEST,
    // ERR_UNAUTHORIZED,
    ERR_NOT_FOUND,
    // ERR_CONFLICT,
    // ERR_PRECONDITION_FAILED,
    ERR_INTERNAL_SERVER_ERROR
} from '../constants';

const log = logger('api:users');
const CONFIG_KEY = 'users';

const useLocal = false;
const owsUrl = useLocal ? 'http://localhost:5000' : 'https://openwork.shop';

// Modify request headers and query parameters to prevent caching
const noCache = (request) => {
    const now = Date.now();
    request.set('Cache-Control', 'no-cache');
    request.set('X-Requested-With', 'XMLHttpRequest');

    if (request.method === 'GET' || request.method === 'HEAD') {
        // Force requested pages not to be cached by the browser by appending "_={timestamp}" to the GET parameters, this will work correctly with HEAD and GET requests. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
        request._query = ensureArray(request._query);
        request._query.push(`_=${now}`);
    }
};

export const owsreq = superagentUse(superagent);
owsreq.use(noCache);

// Generate access token
// https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
// Note. Do not use password and other sensitive fields in the payload
// const generateAccessToken = (payload, secret = settings.secret) => {
//     const token = jwt.sign(payload, secret, {
//         expiresIn: settings.accessTokenLifetime
//     });

//     return token;
// };

const sanitizeRecord = (record) => {
    let shouldUpdate = false;

    if (record.enabled === undefined) {
        record.enabled = true;
        shouldUpdate = true;
    }

    if (!Array.isArray(record.tokens)) {
        record.tokens = [];
        shouldUpdate = true;
    }

    return shouldUpdate;
};

const getSanitizedRecords = () => {
    const records = ensureArray(config.get(CONFIG_KEY, []));

    let shouldUpdate = false;
    for (let i = 0; i < records.length; ++i) {
        if (!isPlainObject(records[i])) {
            records[i] = {};
        }

        if (!records[i].username) {
            // These should not be possible. We need a server ID.
            continue;
        }

        shouldUpdate = sanitizeRecord(records[i]) || shouldUpdate;
    }

    if (shouldUpdate) {
        log.debug(`update sanitized records: ${JSON.stringify(records)}`);

        // Pass `{ silent changes }` will suppress the change event
        config.set(CONFIG_KEY, records, { silent: true });
    }

    return records;
};

// Helper function for auth to get a user given its token.
export const getUserByToken = (token) => {
    const users = getSanitizedRecords();
    return _.find(users, (u) => u.tokens.includes(token));
};

export const signin = (req, res) => {
    const { token = '' } = { ...req.body };
    // const users = getSanitizedRecords();
    // const enabledUsers = users.filter(user => {
    //     return user.enabled;
    // });
    owsreq.use((request) => {
        request.set('Authorization', 'Bearer ' + token);
    });
    owsreq.get(`${owsUrl}/api/users/me`)
        .send()
        .end((err, result) => {
            const body = result ? result.body : {};
            const record = body && body.data ? body.data : {};

            if (err || !record.username) {
                res.send({ enabled: false, error: err ?? 'User not found' });
                return;
            }

            const users = getSanitizedRecords();
            let userIdx = _.findIndex(users, { username: record.username });

            if (userIdx < 0) {
                if (users.length > 1) {
                    // Cannot sign in with a new user when there are already users.
                    res.send({ enabled: false, error: 'Wrong user (cannot access this installation)' });
                    return;
                }
                // Implicitly create the user
                const newUser = { ...record };
                sanitizeRecord(newUser);
                userIdx = users.length;
                users.push(newUser);
            }

            // Make sure the user has the given token
            if (users[userIdx].tokens.indexOf(token) < 0) {
                users[userIdx].tokens.push(token);
                while (users[userIdx].tokens.length > 100) {
                    users[userIdx].tokens.shift();
                }
                log.debug('Added new token for user', record.username);
                config.set(CONFIG_KEY, users);
            }

            res.send({
                enabled: true,
                user: record,
            });
        });

    // if (enabledUsers.length === 0) {
    //     const user = { id: '', name: '' };
    //     const payload = { ...user };
    //     const token = generateAccessToken(payload, settings.secret); // generate access token
    //     res.send({
    //         enabled: false, // session is disabled
    //         token: token,
    //         name: user.name // empty name
    //     });
    //     return;
    // }

    // if (!token) {
    //     const user = find(enabledUsers, { name: name });
    //     const valid = user && bcrypt.compareSync(password, user.password);

    //     if (!valid) {
    //         res.status(ERR_UNAUTHORIZED).send({
    //             msg: 'Authentication failed'
    //         });
    //         return;
    //     }

    //     const payload = {
    //         id: user.id,
    //         name: user.name
    //     };
    //     const token = generateAccessToken(payload, settings.secret); // generate access token
    //     res.send({
    //         enabled: true, // session is enabled
    //         token: token, // new token
    //         name: user.name
    //     });
    //     return;
    // }

    // jwt.verify(token, settings.secret, (err, user) => {
    //     if (err) {
    //         res.status(ERR_INTERNAL_SERVER_ERROR).send({
    //             msg: 'Internal server error'
    //         });
    //         return;
    //     }

    //     const iat = new Date(user.iat * 1000).toISOString();
    //     const exp = new Date(user.exp * 1000).toISOString();
    //     log.debug(`jwt.verify: user.id=${user.id}, user.name=${user.name}, user.iat=${iat}, user.exp=${exp}`);

    //     user = find(enabledUsers, { id: user.id, name: user.name });
    //     if (!user) {
    //         res.status(ERR_UNAUTHORIZED).send({
    //             msg: 'Authentication failed'
    //         });
    //         return;
    //     }

    //     res.send({
    //         enabled: true, // session is enabled
    //         token: token, // old token
    //         name: user.name
    //     });
    // });
};

export const fetch = (req, res) => {
    const records = getSanitizedRecords();
    const paging = !!req.query.paging;

    if (paging) {
        const { page = 1, pageLength = 10 } = req.query;
        const totalRecords = records.length;
        const [begin, end] = getPagingRange({ page, pageLength, totalRecords });
        const pagedRecords = records.slice(begin, end);

        res.send({
            pagination: {
                page: Number(page),
                pageLength: Number(pageLength),
                totalRecords: Number(totalRecords)
            },
            records: pagedRecords.map(record => {
                const { id, mtime, enabled, name } = { ...record };
                return { id, mtime, enabled, name };
            })
        });
    } else {
        res.send({
            records: records.map(record => {
                const { id, mtime, enabled, name } = { ...record };
                return { id, mtime, enabled, name };
            })
        });
    }
};

// export const create = (req, res) => {
//     const {
//         enabled = true,
//         name = '',
//         password = ''
//     } = { ...req.body };

//     if (!name) {
//         res.status(ERR_BAD_REQUEST).send({
//             msg: 'The "name" parameter must not be empty'
//         });
//         return;
//     }

//     if (!password) {
//         res.status(ERR_BAD_REQUEST).send({
//             msg: 'The "password" parameter must not be empty'
//         });
//         return;
//     }

//     const records = getSanitizedRecords();
//     if (find(records, { name: name })) {
//         res.status(ERR_CONFLICT).send({
//             msg: 'The specified user already exists'
//         });
//         return;
//     }

//     try {
//         const salt = bcrypt.genSaltSync();
//         const hash = bcrypt.hashSync(password.trim(), salt);
//         const records = getSanitizedRecords();
//         const record = {
//             id: uuid.v4(),
//             mtime: new Date().getTime(),
//             enabled: enabled,
//             name: name,
//             password: hash
//         };

//         records.push(record);
//         config.set(CONFIG_KEY, records);

//         res.send({ id: record.id, mtime: record.mtime });
//     } catch (err) {
//         res.status(ERR_INTERNAL_SERVER_ERROR).send({
//             msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
//         });
//     }
// };

export const read = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _.find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    const { mtime, enabled, name } = { ...record };
    res.send({ id, mtime, enabled, name });
};

// export const update = (req, res) => {
//     const id = req.params.id;
//     const records = getSanitizedRecords();
//     const record = find(records, { id: id });

//     if (!record) {
//         res.status(ERR_NOT_FOUND).send({
//             msg: 'Not found'
//         });
//         return;
//     }

//     const {
//         enabled = record.enabled,
//         name = record.name,
//         oldPassword = '',
//         newPassword = ''
//     } = { ...req.body };
//     const willChangePassword = oldPassword && newPassword;

//     // Skip validation for "enabled" and "name"

//     if (willChangePassword && !bcrypt.compareSync(oldPassword, record.password)) {
//         res.status(ERR_PRECONDITION_FAILED).send({
//             msg: 'Incorrect password'
//         });
//         return;
//     }

//     const inuse = (record) => {
//         return record.id !== id && record.name === name;
//     };
//     if (some(records, inuse)) {
//         res.status(ERR_CONFLICT).send({
//             msg: 'The specified user already exists'
//         });
//         return;
//     }

//     try {
//         record.mtime = new Date().getTime();
//         record.enabled = Boolean(enabled);
//         record.name = String(name || '');

//         if (willChangePassword) {
//             const salt = bcrypt.genSaltSync();
//             const hash = bcrypt.hashSync(newPassword.trim(), salt);
//             record.password = hash;
//         }

//         config.set(CONFIG_KEY, records);

//         res.send({ id: record.id, mtime: record.mtime });
//     } catch (err) {
//         res.status(ERR_INTERNAL_SERVER_ERROR).send({
//             msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
//         });
//     }
// };

export const __delete = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _.find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    try {
        const filteredRecords = records.filter(record => {
            return record.id !== id;
        });
        config.set(CONFIG_KEY, filteredRecords);

        res.send({ id: record.id });
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};
