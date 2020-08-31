import _ from 'lodash';
import log from 'app/lib/log';
import Limits from 'app/lib/limits';
import series from 'app/lib/promise-series';
import auth from 'app/lib/auth';
import promisify from 'app/lib/promisify';
import api from 'app/api';
import io from 'socket.io-client';
import Controller from 'cncjs-controller';
import store from '../store';
import analytics from './analytics';
import {
    MASLOW,
    GRBL,
    MARLIN,
} from '../constants';

/*
 * Each "Workspace" is a tab in the UI.
 */
class Workspaces {
    static all = {};

    static findByPath(path) {
        return _.find(Workspaces.all, (w) => {
            return w.path === path;
        });
    }

    static load(record) {
        const id = record.id;
        if (_.has(Workspaces.all, id)) {
            Workspaces.all[id]._record = {
                ...Workspaces.all[id]._record,
                ...record
            };
        } else {
            Workspaces.all[id] = new Workspaces(record);
        }
        return Workspaces.all[id];
    }

    static unload(id) {
        if (!_.has(Workspaces.all, id)) {
            return;
        }
        const workspace = Workspaces.all[id];
        workspace.removeControllerEvents(workspace._controllerEvents);
        workspace.closePort();
        delete Workspaces.all[id];
    }

    static connect() {
        const funcs = Object.keys(Workspaces.all).map((id) => {
            return () => promisify(next => {
                const workspace = Workspaces.all[id];
                workspace.controller.connect(auth.host, auth.options, () => {
                    // @see "src/web/containers/Login/Login.jsx"
                    next();
                });
            })();
        });
        return series(funcs);
    }

    static disconnect() {
        Object.keys(Workspaces.all).map((id) => {
            const workspace = Workspaces.all[id];
            return workspace.controller.disconnect();
        });
    }

    // record comes from an API response, loaded from .makerverse
    constructor(record) {
        this._record = record;
        this.addControllerEvents(this._controllerEvents);
    }

    // Convenience method which uses the slug (path without prefix slash)
    get id() {
        return this._record.id;
    }

    get path() {
        return this._record.path;
    }

    get name() {
        return this._record.name;
    }

    get controllerAttributes() {
        return {
            type: this._record.controller.controllerType,
            port: this._record.controller.port,
            baudRate: Number(this._record.controller.baudRate),
            rtscts: !!this._record.controller.rtscts,
            reconnect: !!this._record.controller.reconnect,
        };
    }

    get hasOnboarded() {
        return !!this._record.onboarded;
    }

    set hasOnboarded(val) {
        if (this.hasOnboarded === !!val) {
            return;
        }
        this.updateRecord({
            onboarded: !!val
        });
    }

    // Flag set by main App.jsx to indicate if this is the active workspace.
    get isActive() {
        return this._isActive || false;
    }

    get isImperialUnits() {
        return this.isConnected && _.get(this.controller.state, 'parserstate.modal.units') === 'G20';
    }

    set isActive(active) {
        const wasActive = !!this._isActive;
        this._isActive = !!active;
        if (wasActive !== this._isActive) {
            if (this._isActive) {
                this.onActivated();
            } else {
                this.onDeactivated();
            }
        }
    }

    onActivated() {
        if (this.controllerAttributes.reconnect) {
            this.openPort();
        }
    }

    onDeactivated() { }

    // Sidebar icon.
    get icon() {
        if (_.has(this._record, 'icon')) {
            return this._record.icon;
        }
        let icon = 'xyz';
        if (this.controllerAttributes.type === MASLOW) {
            icon = 'maslow';
        } else if (this.controllerAttributes.type === GRBL) {
            icon = 'cnc';
        } else if (this.controllerAttributes.type === MARLIN) {
            icon = '3dp';
        }
        return `images/icons/${icon}.svg`;
    }

    updateRecord(values) {
        this._record = { ...this._record, values };
        api.workspaces.update(this.id, values);
    }

    // ---------------------------------------------------------------------------------------------
    // Workspaces own controllers, which each represent a single connection to the hardware.
    // WIP: controller is still a global, but it gets (dis/re)connected when switching workspaces.
    // ---------------------------------------------------------------------------------------------

    _controller = new Controller(io);

    _connecting = false;

    _connected = false;

    _controllerState = null;

    _controllerSettings = null;

    _controllerEvents = {
        'serialport:change': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port) {
                return;
            }
            log.debug(`Changed ports to "${port}"`);
        },
        'serialport:open': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port || !this._connecting) {
                return;
            }

            log.debug(`Established a connection to the serial port "${port}"`);
            this._connecting = false;
            this._connected = true;
            analytics.event({
                category: 'controller',
                action: 'open',
                label: this.controllerAttributes.type,
            });
        },
        'serialport:close': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port) {
                return;
            }

            log.debug(`The serial port "${port}" is disconected`);
            this._connecting = false;
            this._connected = false;
            analytics.event({
                category: 'controller',
                action: 'close',
                label: this.controllerAttributes.type,
            });
        },
        'serialport:error': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port) {
                return;
            }

            log.error(`Error opening serial port "${port}"`);
            this._connecting = false;
            this._connected = false;
            analytics.exception({
                description: 'error opening serial port',
                fatal: false,
            });
        },
        'controller:state': (type, state) => {
            log.debug(type, 'state changed', state);
            this._controllerState = state;
        },
        'controller:settings': (type, settings) => {
            log.debug(type, 'settings changed', settings);
            this._controllerSettings = settings;
        }
    };

    get controller() {
        return this._controller;
    }

    get controllerState() {
        return this._controllerState;
    }

    get controllerSettings() {
        return this._controllerSettings;
    }

    get isConnected() {
        return this._connected;
    }

    get isConnecting() {
        return this._connecting;
    }

    openPort(callback) {
        if (this._connected) {
            if (callback) {
                callback(null);
            }
            return;
        }
        const atts = this.controllerAttributes;
        this.controller.openPort(atts.port, {
            controllerType: atts.type,
            baudrate: atts.baudRate,
            rtscts: atts.rtscts
        }, (err) => {
            if (err) {
                this._connecting = false;
                this._connected = false;
                log.error(err);
            }
            if (callback) {
                callback(err);
            }
        });
    }

    closePort(callback) {
        this._connecting = false;
        this._connected = false;
        this.controller.closePort(this.controllerAttributes.port, (err) => {
            if (err) {
                log.error(err);
            }
            if (callback) {
                callback(err);
            }
        });
    }

    addControllerEvents(controllerEvents) {
        Object.keys(controllerEvents).forEach(eventName => {
            const callback = controllerEvents[eventName];
            this.controller.addListener(eventName, callback);
        });
    }

    removeControllerEvents(controllerEvents) {
        Object.keys(controllerEvents).forEach(eventName => {
            const callback = controllerEvents[eventName];
            this.controller.removeListener(eventName, callback);
        });
    }

    // ---------------------------------------------------------------------------------------------
    get centerWidgets() {
        const defaults = ['visualizer'];
        return this.get('container.center.widgets', defaults);
    }

    // ---------------------------------------------------------------------------------------------
    get primaryWidgets() {
        const controllerWidget = this.controllerAttributes.type.toLowerCase();
        return ['connection', 'console', controllerWidget];
    }

    get primaryWidgetsVisible() {
        return this.get('container.primary.visible', true);
    }

    set primaryWidgetsVisible(val) {
        return this.set('container.primary.visible', !!val);
    }

    // ---------------------------------------------------------------------------------------------
    get secondaryWidgets() {
        const defaults = ['axes', 'gcode', 'macro', 'probe', 'spindle', 'laser', 'webcam'];
        return this.get('container.secondary.widgets', defaults);
    }

    set secondaryWidgets(arr) {
        this.set('container.secondary.widgets', arr);
    }

    get secondaryWidgetsVisible() {
        return this.get('container.secondary.visible', true);
    }

    set secondaryWidgetsVisible(val) {
        return this.set('container.secondary.visible', !!val);
    }

    // ---------------------------------------------------------------------------------------------

    get activeWidgetTypes() {
        const centerWidgets = this.centerWidgets.map(widgetId => widgetId.split(':')[0]);
        const primaryWidgets = this.primaryWidgets.map(widgetId => widgetId.split(':')[0]);
        const secondaryWidgets = this.secondaryWidgets.map(widgetId => widgetId.split(':')[0]);
        return _.union(centerWidgets, primaryWidgets, secondaryWidgets);
    }

    get inactiveWidgetTypes() {
        const allWidgets = []; // Object.keys(defaultState.widgets);
        const centerWidgets = this.centerWidgets.map(widgetId => widgetId.split(':')[0]);
        const primaryWidgets = this.primaryWidgets.map(widgetId => widgetId.split(':')[0]);
        const secondaryWidgets = this.secondaryWidgets.map(widgetId => widgetId.split(':')[0]);
        const inactiveWidgets = _.difference(allWidgets, centerWidgets, primaryWidgets, secondaryWidgets);
        return inactiveWidgets;
    }

    get limits() {
        if (!this._limits) {
            this._limits = new Limits(this._record.limits);
        }
        return this._limits;
    }

    // A workspace uses local storage to keep user-level customizations.
    get(settingKey, def) {
        return store.get(`workspace.${this.id}.${settingKey}`, def);
    }

    set(settingKey, value) {
        // Calling store.set() will merge two different arrays into one.
        // Remove the property first to avoid duplication.
        return store.replace(`workspace.${this.id}.${settingKey}`, value);
    }
}

export default Workspaces;
