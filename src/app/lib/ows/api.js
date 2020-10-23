import { authrequest } from 'app/api';
import log from 'app/lib/log';

export const devServer = window.location.origin.includes('dev.makerverse');
export const prodHost = 'https://openwork.shop';
export const devHost = 'http://dev.openwork.shop:5000';
export const host = devServer ? devHost : prodHost;

// Generic OWS API response handler.
export const handler = (res) => {
    if (!res || !res.body) {
        throw new Error('Invalid response');
    }
    if (res.body.errors && res.body.errors.length > 0) {
        res.body.errors.forEach((err) => {
            log.error('API Error', err);
        });
        throw new Error('Server Error');
    }
    if (!res.body.data) {
        throw new Error('Missing response data');
    }
    return res.body.data;
};

// Generic error handler (logging)
export const catcher = (err) => {
    log.error('API Error', err);
    throw err;
};

// Conveniences
export const get = (path) => authrequest.get(`${host}/api/${path}`).then(handler).catch(catcher);
