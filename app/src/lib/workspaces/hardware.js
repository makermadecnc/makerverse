import log from 'js-logger';
import analytics from 'lib/analytics';
import { TTranslateFunc } from '@openworkshop/lib';
import { MASLOW, MARLIN } from 'constants/index';

class Hardware {
  constructor(workspace, controllerType, controllerSettings = {}) {
    this._workspace = workspace;
    this._controllerType = controllerType;
    this.updateControllerSettings(controllerSettings);
  }

  updateControllerSettings(controllerSettings) {
    if (typeof controllerSettings !== 'object') {
      return;
    }

    const hadFirmware = this.hasFirmware;
    this.firmware = controllerSettings.firmware || {};
    this.firmwareStr = this._getVersionStr(this.firmware);
    const updatedFirmware = this.hasFirmware && !hadFirmware;
    if (updatedFirmware) {
      analytics.event({
        category: 'controller',
        action: 'firmware',
        label: this.firmwareStr,
      });
    }

    const hadProtocol = this.hasProtocol;
    this.protocol = controllerSettings.protocol || {};
    this.protocolStr = this._getVersionStr(this.protocol);
    const updatedProtocol = this.hasProtocol && !hadProtocol;
    if (updatedProtocol) {
      analytics.event({
        category: 'controller',
        action: 'protocol',
        label: this.protocolStr,
      });
    }

    const hadPlainVersion = this.hasPlainVersion;
    this.version = controllerSettings.version
      ? { name: this._controllerType, version: controllerSettings.version }
      : {};
    this.versionStr = this._getVersionStr(this.version);
    const updatedVersion = this.hasPlainVersion && !hadPlainVersion;
    if (updatedVersion) {
      analytics.event({
        category: 'controller',
        action: 'version',
        label: this.versionStr,
      });
      console.log('updated version', this.versionStr);
    }

    if ((!this._workspace || this._workspace.isActive) && (updatedFirmware || updatedProtocol)) {
      this._updateAnalytics();
    }
  }

  get controllerType() {
    return this._controllerType;
  }

  // Cast the internal firmware.version to a number, if it exists.
  get firmwareVersion() {
    if (!this.hasFirmware) {
      return null;
    }
    try {
      return Number(this.firmware.version) || 0;
    } catch (e) {
      log.error(e, 'Failed to retrieve firmware version.');
      return null;
    }
  }

  // Simple numeric comparies of requiredVersion against the internal firmware version.
  hasFirmwareVersion(requiredVersion) {
    if (!requiredVersion) {
      return true;
    }
    const actualVersion = this.firmwareVersion;
    if (!actualVersion) {
      return false;
    }
    return actualVersion >= requiredVersion;
  }

  // When this hardware is activated in the current workspace
  onActivated() {
    this._updateAnalytics();
  }

  _updateAnalytics() {
    analytics.set({
      controllerType: this.controllerType,
      firmwareName: this.firmware.name,
      firmwareVersion: this.firmware.version,
      protocolName: this.protocol.name,
      protocolVersion: this.protocol.version,
    });
  }

  // For a firmware or protocol object, combine name & version into a string & set dimensions.
  _getVersionStr(values) {
    if (!values.name && !values.version) {
      return '';
    }
    const name = values.name && values.name.length > 0 ? values.name : '?';
    const vers = values.version && values.version.length > 0 ? values.version : '?';
    return `${name} v${vers}`;
  }

  // A path (unique ID) for this hardware / firmware / protocol
  get path() {
    const parts = [this.controllerType.toLowerCase()];
    if (this.hasFirmware) {
      parts.push(`${this.firmware.name}-${this.firmware.version}`);
    }
    if (this.hasProtocol) {
      parts.push(`${this.protocol.name}-${this.protocol.version}`);
    }
    return '/' + parts.join('/') + '/';
  }

  get hasFirmware() {
    const fw = this.firmware;
    return fw && fw.name && fw.name.length && fw.version;
  }

  get hasProtocol() {
    return this.protocol && this.protocol.name && this.protocol.version;
  }

  // Simply some number reported by the startup
  get hasPlainVersion() {
    return this.version && this.version.name && this.version.version;
  }

  // Is this firmware valid for the machine running on the current Makerverse?
  get isValid() {
    return this.hasProtocol || this.hasPlainVersion || this.hasFirmware;
  }

  get asDictionary() {
    const ret = {};
    if (this.hasProtocol) {
      ret.protocol = { ...this.protocol };
    }
    if (this.hasPlainVersion) {
      ret.version = { ...this.version };
    }
    if (this.hasFirmware) {
      ret.firmware = { ...this.firmware };
    }
    return ret;
  }

  get updateLink() {
    let section = '';
    if (this.controllerType === MASLOW) {
      section = 'cnc/#maslow';
    } else if (this.controllerType === MARLIN) {
      section = '3dp/';
    } else {
      section = 'cnc/';
    }
    return `http://www.makerverse.com/machines/${section}`;
  }
}

export default Hardware;
