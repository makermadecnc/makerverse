import log from 'js-logger';
import authrequest from './authrequest';
import { getOwsHost } from './settings';

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
export const get = (path) => authrequest.get(`${getOwsHost().origin}/api/${path}`).then(handler).catch(catcher);
export const post = (path, data) =>
  authrequest.post(`${getOwsHost().origin}/api/${path}`).send(data).then(handler).catch(catcher);
