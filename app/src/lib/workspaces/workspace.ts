import {Logger} from '@openworkshop/lib/utils/logging/Logger';
import _ from 'lodash';
import {
  MachineControllerType, MachineFeaturePropsFragment,
  MachinePartCompleteFragment,
  MachinePartType,
  MachineSettingPropsFragment
} from '@openworkshop/lib/api/graphql';
import { IOpenWorkShop } from '@openworkshop/lib';
import MachineController, {IWorkflow, MachineCommandType, MachineEventType} from '@openworkshop/open-controller/MachineController';
import api from 'api';
import events from 'events';
import store from 'store';
import {WORKFLOW_STATE_IDLE} from '../../constants';
import MachineSettings from '../MachineSettings';
import ActiveState, {IPos} from './active-state';
import Hardware from './hardware';
import {IWorkspaceRecord, WorkspaceRecord} from './types';
import WorkspaceAxis from './workspace-axis';
import {ControllerEventMap, FeatureMap, Firmware, WorkspaceAxisMap, WorkspaceCommands} from './types';

class Workspace extends events.EventEmitter {
  _record: WorkspaceRecord;

  _isActive = false;

  hardware: Hardware;

  machineSettings: MachineSettings;

  activeState: ActiveState;

  _controller = new MachineController();

  _metricJogSteps?: number[] = undefined;

  _imperialJogSteps?: number[] = undefined;

  _connecting = false;

  _connected = false;

  _controllerState: unknown = null;

  _controllerSettings: unknown = null;

  _ows: IOpenWorkShop;

  _log?: Logger;

  // record comes from an API response, loaded from .makerverse
  constructor(ows:IOpenWorkShop , record: WorkspaceRecord) {
    super();
    this._ows = ows;
    this._record = record;
    this.addControllerEvents(this._controllerEvents);

    const controllerType = this.firmware.controllerType;
    this.hardware = new Hardware(this, controllerType);
    this.machineSettings = new MachineSettings(this, controllerType);
    this.activeState = new ActiveState(controllerType);
  }

  get log(): Logger {
    if (!this._log) this._log = this._ows.logManager.getLogger(this.name);
    return this._log;
  }

  // Convenience method which uses the slug (path without prefix slash)
  get id(): string {
    return this._record.id;
  }

  get path(): string {
    return this._record.path;
  }

  get name(): string {
    return this._record.name;
  }

  get firmware(): Firmware {
    return { ...this._record.firmware };
  }

  get hasOnboarding(): boolean {
    return this.partSettings.length > 0 || this.firmware.controllerType === MachineControllerType.Maslow;
  }

  get hasOnboarded(): boolean {
    return this._record.onboarded;
  }

  set hasOnboarded(val: boolean) {
    if (this.hasOnboarded === val) {
      return;
    }
    this.updateRecord({ ...this._record, onboarded: val });
  }

  // Flag set by main App.jsx to indicate if this is the active workspace.
  get isActive(): boolean {
    return this._isActive || false;
  }

  set isActive(active: boolean) {
    const wasActive = this._isActive;
    this._isActive = active;
    if (wasActive !== this._isActive) {
      if (this._isActive) {
        this.onActivated();
      } else {
        this.onDeactivated();
      }
    }
  }

  get isImperialUnits(): boolean {
    return this.isConnected && this.activeState.isImperialUnits;
  }

  onActivated(): void {
    if (this._record.autoReconnect) {
      void this.openPort();
    }
    this.hardware.onActivated();
  }

  onDeactivated(): void {
    //
  }

  static getControllerTypeIconName(controllerType: MachineControllerType): string {
    if (controllerType === MachineControllerType.Maslow) {
      return 'maslow';
    } else if (controllerType === MachineControllerType.Grbl) {
      return 'cnc';
    } else if (controllerType === MachineControllerType.Marlin) {
      return '3dp';
    }
    return Workspace.defaultIcon;
  }

  static defaultColor = '#4078c0';

  static defaultIcon = 'xyz';

  static defaultBkColor = '#f6f7f8';

  // Sidebar icon.
  get icon(): string {
    return this._record.icon || Workspace.getControllerTypeIconName(this.firmware.controllerType);
  }

  get hexColor(): string {
    return this._record.color || Workspace.defaultColor;
  }

  get bkColor(): string {
    return this._record.bkColor || Workspace.defaultBkColor;
  }

  updateRecord(values: IWorkspaceRecord): void {
    this._record = { ...this._record, ...values };
    void api.workspaces.update(this.id, values);
  }
  // ---------------------------------------------------------------------------------------------
  // PARTS
  // ---------------------------------------------------------------------------------------------

  get parts(): MachinePartCompleteFragment[] {
    return this._record.parts || [];
  }

  findPart(partType: MachinePartType): MachinePartCompleteFragment | undefined {
    const part = _.find(this.parts, { partType: partType });
    return part ? { ...part } : undefined;
  }

  // All settings in parts
  get partSettings(): MachineSettingPropsFragment[] {
    let ret: MachineSettingPropsFragment[] = [];
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

  _axes: WorkspaceAxisMap = {};

  get axes(): WorkspaceAxisMap {
    return this.mapAxes();
  }

  // Iterate all axes; callback receives axis object.
  // Return values from the callback (or else, the settings objects themselves) are mapped into
  // the response, keyed by the same axisKey.
  mapAxes(builder?: (v: WorkspaceAxis) => WorkspaceAxis): WorkspaceAxisMap {
    const ret: WorkspaceAxisMap = {};
    Object.keys(this._record.axes).forEach((axisKey) => {
      if (!_.has(this._axes, axisKey)) {
        this._axes[axisKey] = new WorkspaceAxis(this, axisKey, this._record.axes[axisKey]);
      }
      if (builder) {
        ret[axisKey] = builder(this._axes[axisKey]);
      } else {
        ret[axisKey] = this._axes[axisKey];
      }
    });
    return ret;
  }

  // Find min & max units across all axes to create a single set of jog steps.
  getJogSteps(imperialUnits?: boolean): number[] | undefined {
    let axis: WorkspaceAxis | undefined = undefined;
    const opts = { min: 9999, max: 0, imperialUnits: imperialUnits };
    const div = imperialUnits ? 25.4 : 1;
    const precision = imperialUnits ? 1 : 2;
    const pow = Math.pow(10, precision);
    Object.keys(this.axes).forEach((ak) => {
      const a = this._axes[ak];
      axis = !axis || a.precision > axis.precision ? a : axis;
      opts.max = Math.max(opts.max, Math.round((a.range / 2 / div) * pow) / pow);
      opts.min = Math.min(opts.min, Math.round((a.accuracy / div) * pow) / pow);
    });
    if (!axis) {
      return undefined;
    }
    const a: WorkspaceAxis = axis;
    return a.getJogSteps(opts);
  }

  get imperialJogSteps(): number[] | undefined {
    if (!this._imperialJogSteps) {
      this._imperialJogSteps = this.getJogSteps(true);
    }
    return this._imperialJogSteps;
  }

  get metricJogSteps(): number[] | undefined {
    if (!this._metricJogSteps) {
      this._metricJogSteps = this.getJogSteps(false);
    }
    return this._metricJogSteps;
  }

  // ---------------------------------------------------------------------------------------------
  // wpos / mpos
  // Transformations to ensure that they are returned in mm
  // ---------------------------------------------------------------------------------------------

  _reportedValueToMM(val: number, reportType = 'mpos'): number {
    const ri = this.machineSettings.reportsImperial(this.activeState.isImperialUnits, reportType) as boolean;
    return ri ? val * 25.4 : val;
  }

  get wpos(): IPos {
    return _.mapValues(this.activeState.wpos, (val) => {
      return this._reportedValueToMM(val, 'wpos');
    });
  }

  get mpos(): IPos {
    return _.mapValues(this.activeState.mpos, (val) => {
      return this._reportedValueToMM(val, 'mpos');
    });
  }

  // ---------------------------------------------------------------------------------------------
  // FEATURES
  // Allow for the API to enable/disable anything in this workspace.
  // ---------------------------------------------------------------------------------------------

  get features(): FeatureMap {
    return this._record.features || {};
  }

  getFeature(key: string, defaults: MachineFeaturePropsFragment): MachineFeaturePropsFragment | undefined {
    const f = this.features[key];
    if (f === false) {
      // Disabled feature.
      return undefined;
    }
    return { ...defaults, ...(typeof f !== 'object' ? {} : f) };
  }

  // ---------------------------------------------------------------------------------------------

  _blockingText?: string = undefined;

  // When the Workspace wants to display a message indicating that interaction is disabled.
  get blockingText(): string | undefined {
    return this._blockingText;
  }

  set blockingText(text: string | undefined) {
    this._blockingText = text;
    this.emit('block', text);
  }

  get workflow(): IWorkflow {
    return this.controller.workflow;
  }

  get isReady(): boolean {
    return this.activeState.isReady && this.workflow.state === WORKFLOW_STATE_IDLE;
  }

  async writeCommands(lines: MachineCommandType[], d = 2000): Promise<void> {
    for (let i = 0; i < lines.length; i++) {
      await this.controller.command(lines[i]);
      await new Promise((r) => setTimeout(r, d));
    }
  }

  async writeLines(lines: string[], delay = 2000) {
    for (let i = 0; i < lines.length; i++) {
      await this.controller.writeln(lines[i]);
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Workspaces own controllers, which each represent a single connection to the hardware.
  // WIP: controller is still a global, but it gets (dis/re)connected when switching workspaces.
  // ---------------------------------------------------------------------------------------------

  get commands(): WorkspaceCommands {
    return this._record.commands;
  }

  getCommand(name: string, def = []): string[] {
    return [...(this.commands[name] || def)];
  }

  _controllerEvents: ControllerEventMap = {
    // 'serialport:change': (options) => {
    //   const { port } = options;
    //   if (port !== this.firmware.port) {
    //     return;
    //   }
    //   log.debug(`Changed ports to "${port}"`);
    // },
    // 'serialport:open': (options) => {
    //   const { port } = options;
    //   if (port !== this.firmware.port || !this._connecting) {
    //     return;
    //   }
    //
    //   log.debug(`Established a connection to the serial port "${port}"`);
    //   this._connecting = false;
    //   this._connected = true;
    //   analytics.event({
    //     category: 'controller',
    //     action: 'open',
    //     label: this.firmware.controllerType,
    //   });
    // },
    // 'serialport:close': (options) => {
    //   const { port } = options;
    //   if (port !== this.firmware.port) {
    //     return;
    //   }
    //
    //   log.debug(`The serial port "${port}" is disconected`);
    //   this._connecting = false;
    //   this._connected = false;
    //   analytics.event({
    //     category: 'controller',
    //     action: 'close',
    //     label: this.firmware.controllerType,
    //   });
    // },
    // 'serialport:error': (options) => {
    //   const { port } = options;
    //   if (port !== this.firmware.port) {
    //     return;
    //   }
    //
    //   log.error(`Error opening serial port "${port}"`);
    //   this._connecting = false;
    //   this._connected = false;
    //   analytics.exception({
    //     description: 'error opening serial port',
    //     fatal: false,
    //   });
    // },
    // 'controller:state': (type, state) => {
    //   // log.debug(type, 'state changed', state);
    //   this.activeState.updateControllerState(state);
    //   this._controllerState = state;
    // },
    // 'controller:settings': (type, settings) => {
    //   // log.debug(type, 'settings changed', settings);
    //   this.hardware.updateControllerSettings(settings);
    //   this.machineSettings.update(settings);
    //   this._controllerSettings = settings;
    // }
  };

  get controller(): MachineController {
    return this._controller;
  }

  get controllerState(): unknown {
    return this._controllerState;
  }

  get controllerSettings(): unknown {
    return this._controllerSettings;
  }

  get isConnected(): boolean {
    return this._connected;
  }

  get isConnecting(): boolean {
    return this._connecting;
  }

  async reOpenPort(): Promise<boolean> {
    await this.closePort();
    return await this.openPort();
  }

  async openPort(): Promise<boolean> {
    if (this._connected) {
      return true;
    }
    const firmware = this.firmware;
    this._connecting = true;
    this._connected = false;
    this.log.debug('Open port with firmware', firmware);
    try {
      await this.controller.openPort(firmware);
      return true;
    } catch (e) {
      this._connecting = false;
      this._connected = false;
      this.log.error(e);
    }
    return false;
  }

  async closePort(): Promise<void> {
    if (!this._connecting && !this._connected) {
      return;
    }
    this._connecting = false;
    this._connected = false;
    try {
      await this.controller.closePort(this.firmware.port);
    } catch (e) {
      this.log.error(e);
    }
  }

  addControllerEvents(controllerEvents: ControllerEventMap): void {
    Object.keys(controllerEvents).forEach((eventName) => {
      const callback = controllerEvents[eventName];
      this.controller.addListener(eventName as MachineEventType, callback);
    });
  }

  removeControllerEvents(controllerEvents: ControllerEventMap): void {
    Object.keys(controllerEvents).forEach((eventName) => {
      const callback = controllerEvents[eventName];
      this.controller.removeListener(eventName as MachineEventType, callback);
    });
  }

  // ---------------------------------------------------------------------------------------------
  get centerWidgets(): string[] {
    const defaults = ['visualizer'];
    return this.get('container.center.widgets', defaults);
  }

  // ---------------------------------------------------------------------------------------------
  get primaryWidgets(): string[] {
    const controllerWidget: string = this.firmware.controllerType.toLowerCase();
    return ['connection', 'console', controllerWidget];
  }

  get primaryWidgetsVisible(): boolean {
    return this.get('container.primary.visible', true);
  }

  set primaryWidgetsVisible(val: boolean) {
    this.set('container.primary.visible', !!val);
  }

  // ---------------------------------------------------------------------------------------------
  get secondaryWidgets(): string[] {
    const defaults = ['axes', 'gcode', 'macro', 'probe', 'spindle', 'laser', 'webcam'];
    return this.get('container.secondary.widgets', defaults);
  }

  set secondaryWidgets(arr: string[]) {
    this.set('container.secondary.widgets', arr);
  }

  get secondaryWidgetsVisible(): boolean {
    return this.get('container.secondary.visible', true);
  }

  set secondaryWidgetsVisible(val: boolean) {
    this.set('container.secondary.visible', val);
  }

  // ---------------------------------------------------------------------------------------------

  get activeWidgetTypes(): string[] {
    const centerWidgets = this.centerWidgets.map((widgetId) => widgetId.split(':')[0]);
    const primaryWidgets = this.primaryWidgets.map((widgetId) => widgetId.split(':')[0]);
    const secondaryWidgets = this.secondaryWidgets.map((widgetId) => widgetId.split(':')[0]);
    return _.union(centerWidgets, primaryWidgets, secondaryWidgets);
  }

  get inactiveWidgetTypes(): string[] {
    const allWidgets: string[] = []; // Object.keys(defaultState.widgets);
    const centerWidgets = this.centerWidgets.map((widgetId) => widgetId.split(':')[0]);
    const primaryWidgets = this.primaryWidgets.map((widgetId) => widgetId.split(':')[0]);
    const secondaryWidgets = this.secondaryWidgets.map((widgetId) => widgetId.split(':')[0]);
    return _.difference(allWidgets, centerWidgets, primaryWidgets, secondaryWidgets);
  }

  // A workspace uses local storage to keep user-level customizations.
  get<T>(settingKey: string, def: T): T {
    return store.get(`workspace.${this.id}.${settingKey}`, def) as T;
  }

  set<T>(settingKey: string, value: T) {
    // Calling store.set() will merge two different arrays into one.
    // Remove the property first to avoid duplication.
    return store.replace(`workspace.${this.id}.${settingKey}`, value);
  }
}

export default Workspace;
