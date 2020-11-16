import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ProgressBar } from 'react-bootstrap';
import mapGCodeToText from 'lib/gcode-text';
import i18n from 'lib/i18n';
import Panel from 'components/Panel';
import Toggler from 'components/Toggler';
import { Space } from 'components/';
import { Button } from 'components/Buttons';
import Workspaces from 'lib/workspaces';
import { ToastNotification } from 'components/Notifications';
import FirmwareRequirement from 'containers/Home/CreateWorkspace/FirmwareRequirement';
import styles from './index.styl';
import {
    MODAL_CALIBRATION
} from './constants';

class MaslowPanels extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    // Public methods
    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    getEmptySettings() {
        const ret = {};
        Object.keys(this.workspace.machineSettings.all).forEach((code) => {
            ret[code] = this.workspace.machineSettings.getValue(code);
        });
        return ret;
    }

    state = {
        'settingsEdits': this.getEmptySettings(),
    };

    // https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl
    // Grbl v0.9: BLOCK_BUFFER_SIZE (18), RX_BUFFER_SIZE (128)
    // Grbl v1.1: BLOCK_BUFFER_SIZE (16), RX_BUFFER_SIZE (128)
    plannerBufferMax = 0;

    plannerBufferMin = 0;

    receiveBufferMax = 128;

    receiveBufferMin = 0;

    saveSetting(code) {
        const { settingsEdits } = this.state;
        this.workspace.machineSettings.write({
            [code]: settingsEdits[code],
        });
    }

    controllerEvents = {
        'controller:settings': (type, data) => {
            this.workspace.machineSettings.update(data);
            this.setState({ settingsEdits: this.getEmptySettings() });
        }
    };

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
    }

    componentWillUnmount() {
        this.workspace.removeControllerEvents(this.controllerEvents);
    }


    render() {
        const { state, actions } = this.props;
        const { settingsEdits } = this.state;
        const none = '–';
        const panel = state.panel;
        const controllerState = state.controller.state || {};
        const parserState = _.get(controllerState, 'parserstate', {});
        const activeState = _.get(controllerState, 'status.activeState') || none;
        const feedrate = _.get(controllerState, 'status.feedrate', _.get(parserState, 'feedrate', none));
        const spindle = _.get(controllerState, 'status.spindle', _.get(parserState, 'spindle', none));
        const positionError = _.get(controllerState, 'status.feedback.positionError', false);
        const tool = _.get(parserState, 'tool', none);
        const buf = _.get(controllerState, 'status.buf', {});
        const modal = _.mapValues(parserState.modal || {}, mapGCodeToText);
        const receiveBufferStyle = ((rx) => {
            // danger: 0-7
            // warning: 8-15
            // info: >=16
            rx = Number(rx) || 0;
            if (rx >= 16) {
                return 'info';
            }
            if (rx >= 8) {
                return 'warning';
            }
            return 'danger';
        })(buf.rx);

        this.plannerBufferMax = Math.max(this.plannerBufferMax, buf.planner) || this.plannerBufferMax;
        this.receiveBufferMax = Math.max(this.receiveBufferMax, buf.rx) || this.receiveBufferMax;

        const allSettings = this.workspace.machineSettings.all;
        const firmware = this.workspace.firmware;
        const hardware = this.workspace.hardware;
        const compatibility = hardware.getFirmwareCompatibility(firmware);

        return (
            <div>
                {positionError && (
                    <ToastNotification
                        style={{ marginBottom: '10px' }}
                        type="warning"
                        dismissible={false}
                    >
                        The Maslow cannot find its position. Calibration may have been corrupted.
                        <Button
                            btnSize="medium"
                            btnStyle="flat"
                            onClick={event => this.reset()}
                        >
                            {i18n._('Reset Calibration Settings')}
                        </Button>
                    </ToastNotification>
                )}
                {firmware && hardware.hasFirmware && firmware.requiredVersion && (
                    <div style={{ marginBottom: 10 }}>
                        <FirmwareRequirement firmware={firmware} compatibility={compatibility} />
                    </div>
                )}
                <button
                    type="button"
                    className="btn btn-default"
                    style={{ width: '100%' }}
                    onClick={() => {
                        actions.openModal(MODAL_CALIBRATION);
                    }}
                    title={i18n._('Calibrate')}
                >
                    <i className="fa fa-bullseye" />
                    <Space width="8" />
                    {i18n._('Calibrate')}
                </button>
                <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
                {!_.isEmpty(buf) && (
                    <Panel className={styles.panel}>
                        <Panel.Heading className={styles['panel-heading']}>
                            <Toggler
                                className="clearfix"
                                onToggle={actions.toggleQueueReports}
                                title={panel.queueReports.expanded ? i18n._('Hide') : i18n._('Show')}
                            >
                                <div className="pull-left">{i18n._('Queue Reports')}</div>
                                <Toggler.Icon
                                    className="pull-right"
                                    expanded={panel.queueReports.expanded}
                                />
                            </Toggler>
                        </Panel.Heading>
                        {panel.queueReports.expanded && (
                            <Panel.Body>
                                <div className="row no-gutters">
                                    <div className="col col-xs-4">
                                        <div className={styles.textEllipsis} title={i18n._('Planner Buffer')}>
                                            {i18n._('Planner Buffer')}
                                        </div>
                                    </div>
                                    <div className="col col-xs-8">
                                        <ProgressBar
                                            style={{ marginBottom: 0 }}
                                            bsStyle="info"
                                            min={this.plannerBufferMin}
                                            max={this.plannerBufferMax}
                                            now={buf.planner}
                                            label={(
                                                <span className={styles.progressbarLabel}>
                                                    {buf.planner}
                                                </span>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="row no-gutters">
                                    <div className="col col-xs-4">
                                        <div className={styles.textEllipsis} title={i18n._('Receive Buffer')}>
                                            {i18n._('Receive Buffer')}
                                        </div>
                                    </div>
                                    <div className="col col-xs-8">
                                        <ProgressBar
                                            style={{ marginBottom: 0 }}
                                            bsStyle={receiveBufferStyle}
                                            min={this.receiveBufferMin}
                                            max={this.receiveBufferMax}
                                            now={buf.rx}
                                            label={(
                                                <span className={styles.progressbarLabel}>
                                                    {buf.rx}
                                                </span>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Panel.Body>
                        )}
                    </Panel>
                )}
                {!this.workspace.machineSettings.isValid && (
                    <span style={{ fontStyle: 'italic' }}>
                        Problems detected with Maslow settings:
                        <ul>
                            {this.workspace.machineSettings.errors.map((err) => {
                                return (
                                    <li key={err}>{err}</li>
                                );
                            })}
                        </ul>
                    </span>
                )}
                <Panel className={styles.panel}>
                    <Panel.Heading className={styles['panel-heading']}>
                        <Toggler
                            className="clearfix"
                            onToggle={() => {
                                actions.toggleSettings();
                            }}
                            title={panel.settings.expanded ? i18n._('Hide') : i18n._('Show')}
                        >
                            <div className="pull-left">{i18n._('Settings')}</div>
                            <Toggler.Icon
                                className="pull-right"
                                expanded={panel.settings.expanded}
                            />
                        </Toggler>
                    </Panel.Heading>
                    {panel.settings.expanded && (
                        <Panel.Body>
                            <span style={{ fontStyle: 'italic' }}>
                                Hover over setting names for information.
                            </span>
                            <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
                            {Object.keys(allSettings).map((code) => {
                                const setting = allSettings[code];
                                const name = (setting.message && setting.message.length > 0) ? setting.message : setting.name;
                                const title = `${setting.name}: ${setting.message}`;
                                return (
                                    <div key={code} className="row no-gutters">
                                        <div className="col col-xs-5">
                                            <div className={styles.textEllipsis} title={title}>
                                                {name}
                                            </div>
                                        </div>
                                        <div className="col col-xs-4">
                                            <input
                                                type="text"
                                                className={styles.setting}
                                                value={settingsEdits[code]}
                                                onChange={(e) => {
                                                    this.setState({
                                                        settingsEdits: {
                                                            ...settingsEdits,
                                                            [code]: e.target.value
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col col-xs-1" style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '-2em' }}>
                                            {setting.units}
                                        </div>
                                        <div className="col col-xs-2" style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-default"
                                                onClick={() => {
                                                    this.saveSetting(code);
                                                }}
                                                title={i18n._('Save')}
                                            >
                                                <i className="fa fa-save" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </Panel.Body>
                    )}
                </Panel>
                <Panel className={styles.panel}>
                    <Panel.Heading className={styles['panel-heading']}>
                        <Toggler
                            className="clearfix"
                            onToggle={() => {
                                actions.toggleStatusReports();
                            }}
                            title={panel.statusReports.expanded ? i18n._('Hide') : i18n._('Show')}
                        >
                            <div className="pull-left">{i18n._('Status Reports')}</div>
                            <Toggler.Icon
                                className="pull-right"
                                expanded={panel.statusReports.expanded}
                            />
                        </Toggler>
                    </Panel.Heading>
                    {panel.statusReports.expanded && (
                        <Panel.Body>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('State')}>
                                        {i18n._('State')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {activeState}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Feed Rate')}>
                                        {i18n._('Feed Rate')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {feedrate}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Spindle')}>
                                        {i18n._('Spindle')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {spindle}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Tool Number')}>
                                        {i18n._('Tool Number')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {tool}
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    )}
                </Panel>
                <Panel className={styles.panel}>
                    <Panel.Heading className={styles['panel-heading']}>
                        <Toggler
                            className="clearfix"
                            onToggle={() => {
                                actions.toggleModalGroups();
                            }}
                            title={panel.modalGroups.expanded ? i18n._('Hide') : i18n._('Show')}
                        >
                            <div className="pull-left">{i18n._('Modal Groups')}</div>
                            <Toggler.Icon
                                className="pull-right"
                                expanded={panel.modalGroups.expanded}
                            />
                        </Toggler>
                    </Panel.Heading>
                    {panel.modalGroups.expanded && (
                        <Panel.Body>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Motion')}>
                                        {i18n._('Motion')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.motion}>
                                        {modal.motion || none}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Coordinate')}>
                                        {i18n._('Coordinate')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.wcs}>
                                        {modal.wcs || none}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Distance')}>
                                        {i18n._('Distance')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.distance}>
                                        {modal.distance || none}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Feed Rate')}>
                                        {i18n._('Feed Rate')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.feedrate}>
                                        {modal.feedrate || none}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Units')}>
                                        {i18n._('Units')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.units}>
                                        {modal.units || none}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Program')}>
                                        {i18n._('Program')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well} title={modal.program}>
                                        {modal.program || none}
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    )}
                </Panel>
                <Panel className={styles.panel}>
                    <Panel.Heading className={styles['panel-heading']}>
                        <Toggler
                            className="clearfix"
                            onToggle={() => {
                                actions.toggleAbout();
                            }}
                            title={panel.about.expanded ? i18n._('Hide') : i18n._('Show')}
                        >
                            <div className="pull-left">{i18n._('About')}</div>
                            <Toggler.Icon
                                className="pull-right"
                                expanded={panel.about.expanded}
                            />
                        </Toggler>
                    </Panel.Heading>
                    {panel.about.expanded && (
                        <Panel.Body>
                            {this.workspace.hardware.hasFirmware && (
                                <div className="row no-gutters">
                                    <div className="col col-xs-4">
                                        <div className={styles.textEllipsis} title={i18n._('Firmware')}>
                                            {i18n._('Firmware')}
                                        </div>
                                    </div>
                                    <div className="col col-xs-8">
                                        <div className={styles.well}>
                                            {this.workspace.hardware.firmwareStr}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.workspace.hardware.hasProtocol && (
                                <div className="row no-gutters">
                                    <div className="col col-xs-4">
                                        <div className={styles.textEllipsis} title={i18n._('Protocol')}>
                                            {i18n._('Protocol')}
                                        </div>
                                    </div>
                                    <div className="col col-xs-8">
                                        <div className={styles.well}>
                                            {this.workspace.hardware.protocolStr}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {this.workspace.hardware.hasPlainVersion && (
                                <div className="row no-gutters">
                                    <div className="col col-xs-4">
                                        <div className={styles.textEllipsis} title={i18n._('Version')}>
                                            {i18n._('Version')}
                                        </div>
                                    </div>
                                    <div className="col col-xs-8">
                                        <div className={styles.well}>
                                            {this.workspace.hardware.versionStr}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Panel.Body>
                    )}
                </Panel>
            </div>
        );
    }
}

export default MaslowPanels;
