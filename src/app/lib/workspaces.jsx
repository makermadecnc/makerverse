import _ from 'lodash';
import log from 'app/lib/log';
import events from 'events';
import WorkspaceAxis from 'app/lib/workspace-axis';
import MachineSettings from 'app/lib/MachineSettings';
import api from 'app/api';
import io from 'socket.io-client';
import Controller from 'cncjs-controller';
import store from '../store';
import analytics from './analytics';
import Hardware from './hardware';
import ActiveState from './active-state';
import {
    MASLOW,
    GRBL,
    MARLIN,
    WORKFLOW_STATE_IDLE,
} from '../constants';

/*
 * Each "Workspace" is a tab in the UI.
 */
class Workspaces extends events.EventEmitter {
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

    static disconnect() {
        Object.keys(Workspaces.all).map((id) => {
            const workspace = Workspaces.all[id];
            return workspace.controller.disconnect();
        });
    }

    // record comes from an API response, loaded from .makerverse
    constructor(record) {
        super();
        this._record = record;
        this.addControllerEvents(this._controllerEvents);

        const controllerType = this.firmware.controllerType;
        this.hardware = new Hardware(this, controllerType);
        this.machineSettings = new MachineSettings(this, controllerType);
        this.activeState = new ActiveState(controllerType);
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

    get firmware() {
        return {
            ...this._record.firmware,
            controllerType: this._record.firmware.controllerType || this._record.firmware.type,
            port: this._record.firmware.port,
            baudRate: Number(this._record.firmware.baudRate),
            rtscts: !!this._record.firmware.rtscts,
            reconnect: !!this._record.firmware.reconnect,
        };
    }

    get hasOnboarding() {
        return this.partSettings.length > 0 || this.firmware.controllerType === MASLOW;
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
        return this.isConnected && this.activeState.isImperialUnits;
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
        if (this._record.autoReconnect) {
            this.openPort();
        }
        this.hardware.onActivated();
    }

    onDeactivated() { }

    static getControllerTypeIconName(controllerType) {
        if (controllerType === MASLOW) {
            return 'maslow';
        } else if (controllerType === GRBL) {
            return 'cnc';
        } else if (controllerType === MARLIN) {
            return '3dp';
        }
        return Workspaces.defaultIcon;
    }

    static defaultColor = '#4078c0';
    static defaultIcon = 'xyz';
    static defaultBkColor = '#f6f7f8';

    // Sidebar icon.
    get icon() {
        if (_.has(this._record, 'icon') && this._record.icon.includes('/')) {
            return this._record.icon;
        }
        const icon = this._record.icon ||
            Workspaces.getControllerTypeIconName(this.firmware.controllerType);
        return `images/icons/${icon}.svg`;
    }

    get hexColor() {
        return this._record.color || Workspaces.defaultColor;
    }

    get bkColor() {
        return this._record.bkColor || Workspaces.defaultBkColor;
    }

    updateRecord(values) {
        this._record = { ...this._record, values };
        api.workspaces.update(this.id, values);
    }
    // ---------------------------------------------------------------------------------------------
    // PARTS
    // ---------------------------------------------------------------------------------------------

    get parts() {
        return this._record.parts || [];
    }

    findPart(partType) {
        const part = _.find(this.parts, { partType: partType.toUpperCase() });
        return part ? { ...part } : null;
    }

    // All settings in parts
    get partSettings() {
        let ret = [];
        this.parts.forEach((part) => {
            const settings = part.settings || [];
            ret = ret.concat(settings);
        });
        return ret;
    }

    // ---------------------------------------------------------------------------------------------
    // AXES
    // Each machine may have its own precision, accuracy, etc. for each axis.
    // ---------------------------------------------------------------------------------------------

    _axes = {};

    get axes() {
        return this.mapAxes();
    }

    // Iterate all axes; callback receives axis object.
    // Return values from the callback (or else, the settings objects themselves) are mapped into
    // the response, keyed by the same axisKey.
    mapAxes(callback = null) {
        const ret = {};
        Object.keys(this._record.axes).forEach((axisKey) => {
            if (!_.has(this._axes, axisKey)) {
                this._axes[axisKey] = new WorkspaceAxis(this, axisKey, this._record.axes[axisKey]);
            }
            if (callback) {
                ret[axisKey] = callback(this._axes[axisKey]);
            } else {
                ret[axisKey] = this._axes[axisKey];
            }
        });
        return ret;
    }

    // Find min & max units across all axes to create a single set of jog steps.
    getJogSteps(imperialUnits = null) {
        let axis = null;
        const opts = { min: 9999, max: 0, imperialUnits: imperialUnits };
        const div = imperialUnits ? 25.4 : 1;
        const precision = imperialUnits ? 1 : 2;
        const pow = Math.pow(10, precision);
        Object.keys(this.axes).forEach((ak) => {
            const a = this._axes[ak];
            axis = (!axis || a.precision > axis.precision) ? a : axis;
            opts.max = Math.max(opts.max, Math.round(a.range / 2 / div * pow) / pow);
            opts.min = Math.min(opts.min, Math.round(a.accuracy / div * pow) / pow);
        });
        return axis ? axis.getJogSteps(opts) : null;
    }

    _imperialJogSteps = null;

    get imperialJogSteps() {
        if (!this._imperialJogSteps) {
            this._imperialJogSteps = this.getJogSteps(true);
        }
        return this._imperialJogSteps;
    }

    _metricJogSteps = null;

    get metricJogSteps() {
        if (!this._metricJogSteps) {
            this._metricJogSteps = this.getJogSteps(false);
        }
        return this._metricJogSteps;
    }

    // ---------------------------------------------------------------------------------------------
    // wpos / mpos
    // Transformations to ensure that they are returned in mm
    // ---------------------------------------------------------------------------------------------

    _reportedValueToMM(val, reportType = 'mpos') {
        const ri = this.machineSettings.reportsImperial(this.activeState.isImperialUnits, reportType);
        return ri ? (val * 25.4) : val;
    }

    get wpos() {
        return _.mapValues(this.activeState.wpos, (val) => {
            return this._reportedValueToMM(val, 'wpos');
        });
    }

    get mpos() {
        return _.mapValues(this.activeState.mpos, (val) => {
            return this._reportedValueToMM(val, 'mpos');
        });
    }

    // ---------------------------------------------------------------------------------------------
    // FEATURES
    // Allow for the API to enable/disable anything in this workspace.
    // ---------------------------------------------------------------------------------------------

    get features() {
        return this._record.features || {};
    }

    getFeature(key, defaults) {
        const f = this.features[key];
        if (f === false) {
            // Disabled feature.
            return null;
        }
        return { ...defaults, ...(typeof f !== 'object' ? {} : f) };
    }

    // ---------------------------------------------------------------------------------------------

    _blockingText = null;

    // When the Workspace wants to display a message indicating that interaction is disabled.
    get blockingText() {
        return this._blockingText;
    }

    set blockingText(text) {
        this._blockingText = text;
        this.emit('block', text);
    }

    get isReady() {
        return this.activeState.isReady && this.controller.workflow.state === WORKFLOW_STATE_IDLE;
    }

    writeCommands(lines, callback = null, delay = 2000) {
        this._writer(this.controller.command.bind(this.controller), lines, callback, delay);
    }

    writeLines(lines, callback = null, delay = 2000) {
        this._writer(this.controller.writeln.bind(this.controller), lines, callback, delay);
    }

    _writer(func, lines, callback, delay) {
        if (lines.length <= 0) {
            if (callback) {
                callback();
            }
            return;
        }
        const line = lines.shift();
        log.debug(line);
        func(line);
        setTimeout(() => {
            this._writer(func, lines, callback, delay);
        }, delay);
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

    get commands() {
        return this._record.commands;
    }

    getCommand(name, def = []) {
        return [].concat(this.commands[name] || def);
    }

    _controllerEvents = {
        'serialport:change': (options) => {
            const { port } = options;
            if (port !== this.firmware.port) {
                return;
            }
            log.debug(`Changed ports to "${port}"`);
        },
        'serialport:open': (options) => {
            const { port } = options;
            if (port !== this.firmware.port || !this._connecting) {
                return;
            }

            log.debug(`Established a connection to the serial port "${port}"`);
            this._connecting = false;
            this._connected = true;
            analytics.event({
                category: 'controller',
                action: 'open',
                label: this.firmware.controllerType,
            });
        },
        'serialport:close': (options) => {
            const { port } = options;
            if (port !== this.firmware.port) {
                return;
            }

            log.debug(`The serial port "${port}" is disconected`);
            this._connecting = false;
            this._connected = false;
            analytics.event({
                category: 'controller',
                action: 'close',
                label: this.firmware.controllerType,
            });
        },
        'serialport:error': (options) => {
            const { port } = options;
            if (port !== this.firmware.port) {
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
            // log.debug(type, 'state changed', state);
            this.activeState.updateControllerState(state);
            this._controllerState = state;
        },
        'controller:settings': (type, settings) => {
            // log.debug(type, 'settings changed', settings);
            this.hardware.updateControllerSettings(settings);
            this.machineSettings.update(settings);
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

    reOpenPort(callback) {
        this.closePort(() => {
            this.openPort(callback);
        });
    }

    openPort(callback) {
        if (this._connected) {
            if (callback) {
                callback(null);
            }
            return;
        }
        const firmware = this.firmware;
        this._connecting = true;
        this._connected = false;
        log.debug('Open port with firmware', firmware);
        this.controller.openPort(firmware.port, {
            controllerType: firmware.controllerType,
            baudrate: firmware.baudRate || firmware.baudrate,
            rtscts: !!firmware.rtscts
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
        if (!this._connecting && !this._connected) {
            if (callback) {
                callback(null);
            }
        }
        this._connecting = false;
        this._connected = false;
        this.controller.closePort(this.firmware.port, (err) => {
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
        const controllerWidget = this.firmware.controllerType.toLowerCase();
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
