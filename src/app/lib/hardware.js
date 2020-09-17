import analytics from 'app/lib/analytics';
import {
    MASLOW,
    MARLIN,
} from 'app/constants';

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
        this.firmwareStr = this._getVersionStr('firmware', this.firmware);
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
        this.protocolStr = this._getVersionStr('protocol', this.protocol);
        const updatedProtocol = this.hasProtocol && !hadProtocol;
        if (updatedProtocol) {
            analytics.event({
                category: 'controller',
                action: 'protocol',
                label: this.protocolStr,
            });
        }

        if ((!this._workspace || this._workspace.isActive) && (updatedFirmware || updatedProtocol)) {
            this._updateAnalytics();
        }
    }

    get controllerType() {
        return this._controllerType;
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
    _getVersionStr(key, values) {
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
        return this.firmware && this.firmware.name && this.firmware.version;
    }

    get hasProtocol() {
        return this.protocol && this.protocol.name && this.protocol.version;
    }

    // Is this firmware valid for the machine running on the current Makerverse?
    get isValid() {
        const fstr = `${this.firmwareStr} ${this.protocolStr}`.toLowerCase();
        return fstr.includes(this._controllerType.toLowerCase());
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
