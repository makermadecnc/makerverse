import ensureArray from 'ensure-array';
import superagent from 'superagent';
import superagentUse from 'superagent-use';
import { getOwsHost } from './settings';
import store from '../../store';

export const bearer = (request) => {
    const token = store.get('session.token');
    if (token) {
        request.set('Authorization', 'Bearer ' + token);
    }
    const owsHost = getOwsHost().origin;
    if (owsHost.includes('dev.') || owsHost.includes('staging.')) {
        request._query.push(`ows=${encodeURIComponent(owsHost)}`);
    }
};

// Modify request headers and query parameters to prevent caching
export const noCache = (request) => {
    const now = Date.now();
    request.set('Cache-Control', 'no-cache');
    request.set('X-Requested-With', 'XMLHttpRequest');

    if (request.method === 'GET' || request.method === 'HEAD') {
        // Force requested pages not to be cached by the browser by appending "_={timestamp}" to the GET parameters, this will work correctly with HEAD and GET requests. The parameter is not needed for other types of requests, except in IE8 when a POST is made to a URL that has already been requested by a GET.
        request._query = ensureArray(request._query);
        request._query.push(`_=${now}`);
    }
};

const authrequest = superagentUse(superagent);
authrequest.use(bearer);
authrequest.use(noCache);

export default authrequest;
