import _ from 'lodash';
import store from '../store';
import controller from './controller';
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

    // Easy access to the current UI tab (if applicable).
    static get current() {
        return null;
    }

    static findByPath(path) {
        return _.find(Workspaces.all, (w) => {
            return w.path === path;
        });
    }

    static load(record) {
        const workspace = new Workspaces(record);
        Workspaces.all[workspace.id] = workspace;
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

    // Workspaces own controllers, which each represent a single connection to the hardware.
    get controller() {
        return controller;
    }

    // Sidebar icon.
    get icon() {
        if (_.has(this._record, 'icon')) {
            return this._record.icon;
        }
        let icon = 'xyz';
        if (this.controllerType === MASLOW) {
            icon = 'maslow';
        } else if (this.controllerType === GRBL) {
            icon = 'cnc';
        } else if (this.controllerType === MARLIN) {
            icon = '3dp';
        }
        return `images/icons/${icon}.svg`;
    }

    get controllerType() {
        return this._record.controller.controllerType;
    }

    // ---------------------------------------------------------------------------------------------
    get centerWidgets() {
        const defaults = ['visualizer'];
        return this.get('container.center.widgets', defaults);
    }

    // ---------------------------------------------------------------------------------------------
    get primaryWidgets() {
        const ret = ['connection', this.controllerType.toLowerCase()];
        return ret;
    }

    get primaryWidgetsVisible() {
        return this.get('container.primary.visible', true);
    }

    set primaryWidgetsVisible(val) {
        return this.set('container.primary.visible', !!val);
    }

    // ---------------------------------------------------------------------------------------------
    get secondaryWidgets() {
        const defaults = ['axes', 'gcode', 'macro', 'probe', 'spindle', 'laser'];
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

    get machineProfile() {
        return {
            name: this.name,
            limits: this._record.limits,
        };
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
