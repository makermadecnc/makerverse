import semver from 'semver';
import log from 'js-logger';
import settings from 'config/settings';
import { parseSemver } from 'lib/semvers';
import authrequest from 'lib/ows/authrequest';
import store from '../store';

function api(path) {
  return `/api/${path}`;
}

//
// Latest Version
//
const getLatestVersion = (prereleases) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/version/latest').end((err, res) => {
      if (err) {
        reject(res);
      } else if (!res.body.release || !res.body.prerelease) {
        log.warn('missing version data');
        reject(res);
      } else {
        const usePre = prereleases && semver.lt(res.body.release.tag_name, res.body.prerelease.tag_name);
        const latestRelease = usePre ? res.body.prerelease : res.body.release;
        const latestVersion = parseSemver(latestRelease.tag_name);
        const isNewer = semver.lt(settings.version.public, latestVersion.public);
        resolve({
          currentVersion: settings.version,
          latestVersion: latestVersion,
          lastUpdate: latestRelease.published_at,
          updateAvailable: isNewer,
          updateUrl: latestRelease.html_url,
          release: latestRelease,
        });
      }
    });
  });

//
// State
//
const getState = (options) =>
  new Promise((resolve, reject) => {
    const { key } = { ...options };

    authrequest
      .get('/api/state')
      .query({ key: key })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

const setState = (options) =>
  new Promise((resolve, reject) => {
    const data = { ...options };

    authrequest
      .post('/api/state')
      .send(data)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

const unsetState = (options) =>
  new Promise((resolve, reject) => {
    const { key } = { ...options };

    authrequest
      .delete('/api/state')
      .query({ key: key })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

//
// G-code
//
const loadGCode = (options) =>
  new Promise((resolve, reject) => {
    const { port = '', name = '', gcode = '', context = {} } = { ...options };

    authrequest
      .post('/api/gcode')
      .send({ port, name, gcode, context })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

const fetchGCode = (options) =>
  new Promise((resolve, reject) => {
    const { port = '' } = { ...options };

    authrequest
      .get('/api/gcode')
      .query({ port: port })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

const downloadGCode = (options) => {
  const { port = '' } = { ...options };

  const $form = document.createElement('form');
  $form.setAttribute('id', 'export');
  $form.setAttribute('method', 'POST');
  $form.setAttribute('enctype', 'multipart/form-data');
  $form.setAttribute('action', 'api/gcode/download');

  const $port = document.createElement('input');
  $port.setAttribute('name', 'port');
  $port.setAttribute('value', port);

  const $token = document.createElement('input');
  $token.setAttribute('name', 'token');
  $token.setAttribute('value', store.get('session.token'));

  $form.appendChild($port);
  $form.appendChild($token);

  document.body.append($form);
  $form.submit();
  document.body.removeChild($form);
};

//
// Controllers
//
const controllers = {};

controllers.get = () =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/controllers').end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

//
// Watch Directory
//
const watch = {};

watch.getFiles = (options) =>
  new Promise((resolve, reject) => {
    const { path } = { ...options };

    authrequest
      .post('/api/watch/files')
      .send({ path })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

watch.readFile = (options) =>
  new Promise((resolve, reject) => {
    const { file } = { ...options };

    authrequest
      .post('/api/watch/file')
      .send({ file })
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

//
// Users
//
const users = {};

users.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/users')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

users.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/users')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

users.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/users/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

users.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/users/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

users.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/users/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

//
// Events
//
const events = {};

events.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/events')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

events.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/events')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

events.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/events/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

events.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/events/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

events.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/events/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

//
// Macros
//
const macros = {};

macros.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/macros')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

macros.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/macros')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

macros.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/macros/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

macros.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/macros/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

macros.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/macros/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

//
// MDI
//
const mdi = {};

mdi.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/mdi')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

mdi.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/mdi')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

mdi.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/mdi/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

mdi.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/mdi/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

mdi.bulkUpdate = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/mdi/')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

mdi.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/mdi/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

//
// Commands
//
const commands = {};

commands.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/commands')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

commands.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/commands')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

commands.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/commands/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

commands.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/commands/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

commands.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/commands/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

commands.run = (id) =>
  new Promise((resolve, reject) => {
    authrequest.post('/api/commands/run/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

//
// Workspaces
//
const workspaces = {};

workspaces.fetch = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .get('/api/workspaces')
      .query(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

workspaces.create = (options) =>
  new Promise((resolve, reject) => {
    authrequest
      .post('/api/workspaces')
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

workspaces.read = (id) =>
  new Promise((resolve, reject) => {
    authrequest.get('/api/workspaces/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

workspaces.update = (id, options) =>
  new Promise((resolve, reject) => {
    authrequest
      .put('/api/workspaces/' + id)
      .send(options)
      .end((err, res) => {
        if (err) {
          reject(res);
        } else {
          resolve(res);
        }
      });
  });

workspaces.delete = (id) =>
  new Promise((resolve, reject) => {
    authrequest.delete('/api/workspaces/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

workspaces.run = (id) =>
  new Promise((resolve, reject) => {
    authrequest.post('/api/workspaces/run/' + id).end((err, res) => {
      if (err) {
        reject(res);
      } else {
        resolve(res);
      }
    });
  });

export default {
  getLatestVersion,

  // State
  getState,
  setState,
  unsetState,

  // G-code
  loadGCode,
  fetchGCode,
  downloadGCode,

  // Controllers
  controllers,

  // Watch Directory
  watch,

  // Settings
  commands,
  events,
  workspaces,
  macros,
  mdi,
  users,
};
