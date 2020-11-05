import isElectron from 'is-electron';
import log from 'js-logger';
import ensureArray from 'ensure-array';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import merge from 'lodash/merge';
import semver from 'semver';
import settings from '../config/settings';
import ImmutableStore from '../lib/immutable-store';
import defaultState from './defaultState';

const store = new ImmutableStore(defaultState);

let userData = null;

// Check whether the code is running in Electron renderer process
if (isElectron()) {
    const electron = window.require('electron');
    const path = window.require('path'); // Require the path module within Electron
    const app = electron.remote.app;
    userData = {
        path: path.join(app.getPath('userData'), 'cnc.json')
    };
}

const getConfig = () => {
    let content = '';

    // Check whether the code is running in Electron renderer process
    if (isElectron()) {
        const fs = window.require('fs'); // Require the fs module within Electron
        if (fs.existsSync(userData.path)) {
            content = fs.readFileSync(userData.path, 'utf8') || '{}';
        }
    } else {
        content = localStorage.getItem('cnc') || '{}';
    }

    return content;
};

const persist = (data) => {
    const { version, state } = { ...data };

    data = {
        version: version || settings.version,
        state: {
            ...store.state,
            ...state
        }
    };

    try {
        const value = JSON.stringify(data, null, 2);

        // Check whether the code is running in Electron renderer process
        if (isElectron()) {
            const fs = window.require('fs'); // Use window.require to require fs module in Electron
            fs.writeFileSync(userData.path, value);
        } else {
            localStorage.setItem('cnc', value);
        }
    } catch (e) {
        log.error(e);
    }
};

const normalizeState = (state) => {
    //
    // Remember configured axes (#416)
    //
    const configuredAxes = ensureArray(get(cnc.state, 'widgets.axes.axes'));
    const defaultAxes = ensureArray(get(defaultState, 'widgets.axes.axes'));
    if (configuredAxes.length > 0) {
        set(state, 'widgets.axes.axes', configuredAxes);
    } else {
        set(state, 'widgets.axes.axes', defaultAxes);
    }

    return state;
};

const cnc = {
    version: settings.version,
    state: {}
};

try {
    const text = getConfig();
    const data = JSON.parse(text);
    cnc.version = get(data, 'version', settings.version);
    cnc.state = get(data, 'state', {});
} catch (e) {
    set(settings, 'error.corruptedWorkspaceSettings', true);
    log.error(e);
}

store.state = normalizeState(merge({}, defaultState, cnc.state || {}));

// Debouncing enforces that a function not be called again until a certain amount of time (e.g. 100ms) has passed without it being called.
store.on('change', debounce((state) => {
    persist({ state: state });
}, 100));

//
// Migration
//
const migrateStore = () => {
    if (!cnc.version) {
        return;
    }

    // 1.9.0
    // * Renamed "widgets.probe.tlo" to "widgets.probe.touchPlateHeight"
    // * Removed "widgets.webcam.scale"
    if (semver.lt(cnc.version.public, '1.9.0')) {
        // Probe widget
        const tlo = store.get('widgets.probe.tlo');
        if (tlo !== undefined) {
            store.set('widgets.probe.touchPlateHeight', Number(tlo));
            store.unset('widgets.probe.tlo');
        }
    }

    // 1.9.13
    // Removed "widgets.axes.wzero"
    // Removed "widgets.axes.mzero"
    // Removed "widgets.axes.jog.customDistance"
    // Removed "widgets.axes.jog.selectedDistance"
    if (semver.lt(cnc.version.public, '1.9.13')) {
        // Axes widget
        store.unset('widgets.axes.wzero');
        store.unset('widgets.axes.mzero');
        store.unset('widgets.axes.jog.customDistance');
        store.unset('widgets.axes.jog.selectedDistance');
    }

    // 1.9.16
    // Removed "widgets.axes.wzero"
    // Removed "widgets.axes.mzero"
    // Removed "widgets.axes.jog.customDistance"
    // Removed "widgets.axes.jog.selectedDistance"
    if (semver.lt(cnc.version.public, '1.9.16')) {
        store.unset('widgets.axes.jog.step');
    }
};

try {
    migrateStore();
} catch (err) {
    log.error(err);
}

const resetDefaults = () => {
    // Reset to default state
    store.state = defaultState;

    // Persist data locally
    store.persist();
};

store.getConfig = getConfig;
store.persist = persist;
store.resetDefaults = resetDefaults;

export default store;
