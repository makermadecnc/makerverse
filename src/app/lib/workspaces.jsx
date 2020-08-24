import _ from 'lodash';
import log from 'app/lib/log';
import Limits from 'app/lib/limits';
import series from 'app/lib/promise-series';
import auth from 'app/lib/auth';
import promisify from 'app/lib/promisify';
import io from 'socket.io-client';
import Controller from 'cncjs-controller';
import store from '../store';
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
        const workspace = new Workspaces(record);
        Workspaces.all[workspace.id] = workspace;
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

    // record comes from an API response, loaded from .cncrc
    constructor(record) {
        this._record = record;
    }

    // Convenience method which uses the slug (path without prefix slash)
    get id() {
        return this.path.substr(1);
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
        this.addControllerEvents(this._controllerEvents);
        if (this.controllerAttributes.reconnect) {
            this.openPort();
        }
    }

    onDeactivated() {
        this.removeControllerEvents(this._controllerEvents);
        this.closePort();
    }

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

    // ---------------------------------------------------------------------------------------------
    // Workspaces own controllers, which each represent a single connection to the hardware.
    // WIP: controller is still a global, but it gets (dis/re)connected when switching workspaces.
    // ---------------------------------------------------------------------------------------------

    _controller = new Controller(io);
    _connecting = false;
    _connected = false;

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
        },
        'serialport:close': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port) {
                return;
            }

            log.debug(`The serial port "${port}" is disconected`);
            this._connecting = false;
            this._connected = false;
        },
        'serialport:error': (options) => {
            const { port } = options;
            if (port !== this.controllerAttributes.port) {
                return;
            }

            log.error(`Error opening serial port "${port}"`);
            this._connecting = false;
            this._connected = false;
        }
    };

    get controller() {
        return this._controller;
    }

    get isConnected() {
        return this._connected;
    }

    get isConnecting() {
        return this._connecting;
    }

    openPort(callback) {
        const atts = this.controllerAttributes;
        this.controller.openPort(atts.port, {
            controllerType: atts.type,
            baudrate: atts.baudRate,
            rtscts: atts.rtscts
        }, (err) => {
            if (err) {
                this._connecting = false;
                this._connected = false;
                log.err(err);
            }
            if (callback) {
                callback(err);
            }
        });
    }

    closePort(callback) {
        this._connecting = false;
        if (!this.isConnected) {
            return;
        }
        this._connected = false;
        this.controller.closePort(this.controllerAttributes.port, (err) => {
            if (err) {
                log.err(err);
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
