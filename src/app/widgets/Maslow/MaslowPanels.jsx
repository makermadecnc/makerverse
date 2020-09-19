import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ProgressBar } from 'react-bootstrap';
import mapGCodeToText from 'app/lib/gcode-text';
import i18n from 'app/lib/i18n';
import Panel from 'app/components/Panel';
import Toggler from 'app/components/Toggler';
import Space from 'app/components/Space';
import { Button } from 'app/components/Buttons';
import Workspaces from 'app/lib/workspaces';
import { ToastNotification } from 'app/components/Notifications';
import styles from './index.styl';
import {
    MODAL_CALIBRATION
} from './constants';

const MASLOW_MIN_FIRMWARE_CLASSIC = 51.28;
const MASLOW_MIN_FIRMWARE_DUE = 20200905;
const MASLOW_CUR_FIRMWARE_DUE = 20200915;

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

    state = {
        'settingsEdits': this.emptySettings,
    };

    get emptySettings() {
        const ret = {};
        Object.keys(this.workspace.machineSettings.map).forEach((code) => {
            const setting = this.workspace.machineSettings.map[code];
            ret[code] = setting.value;
        });
        return ret;
    }

    // https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl
    // Grbl v0.9: BLOCK_BUFFER_SIZE (18), RX_BUFFER_SIZE (128)
    // Grbl v1.1: BLOCK_BUFFER_SIZE (16), RX_BUFFER_SIZE (128)
    plannerBufferMax = 0;

    plannerBufferMin = 0;

    receiveBufferMax = 128;

    receiveBufferMin = 0;

    renderError(top, classicLink, dueLink) {
        const firmwareLink = classicLink || dueLink;
        return (
            <div className={styles.noConnection}>
                {top}
                {firmwareLink && <hr style={{ marginTop: '10px', marginBottom: '10px' }} />}
                {classicLink && (
                    <div>
                        Download the <a href="https://github.com/WebControlCNC/Firmware/tree/release/holey" target="_blank" rel="noopener noreferrer">Arduino Mega (Holey) firmware</a>.
                    </div>
                )}
                {dueLink && (
                    <div>
                        Download the <a href="https://github.com/makermadecnc/MaslowDue" target="_blank" rel="noopener noreferrer">Arduino Due (M2) firmware</a>.
                    </div>
                )}
            </div>
        );
    }

    saveSetting(key) {
        const { settingsEdits } = this.state;
        const controllerSettings = this.props.state.controller.settings || {};
        this.workspace.machineSettings.write({
            [key]: _.has(settingsEdits, key) ? settingsEdits[key] : controllerSettings.grbl[key].value,
        });
    }

    render() {
        const { state, actions } = this.props;
        const { settingsEdits } = this.state;
        const none = '–';
        const panel = state.panel;
        const controllerState = state.controller.state || {};
        const controllerSettings = state.controller.settings || {};
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

        this.workspace.machineSettings.update(controllerSettings);

        this.plannerBufferMax = Math.max(this.plannerBufferMax, buf.planner) || this.plannerBufferMax;
        this.receiveBufferMax = Math.max(this.receiveBufferMax, buf.rx) || this.receiveBufferMax;

        const fv = controllerSettings.firmware ? (Number(controllerSettings.firmware.version) || 0) : 0;
        const fn = controllerSettings.firmware ? controllerSettings.firmware.name : null;

        let banner = null;

        if (!fn || fn.length <= 0) {
            return this.renderError((
                <span>
                    No compatible device detected.
                    <br /><br />
                    The firmware is not reporting any known Maslow versions.
                    This is common if you plugged in a regular Grbl device, like the M2 with factory firmware.
                </span>),
            true, true);
        } else if (fn === 'MaslowClassic') {
            if (fv < MASLOW_MIN_FIRMWARE_CLASSIC) {
                return this.renderError(`Please upgrade your Maslow Holey firmware (${MASLOW_MIN_FIRMWARE_CLASSIC} or later).`, true, false);
            }
        } else if (fn === 'MaslowDue') {
            if (fv < MASLOW_MIN_FIRMWARE_DUE) {
                return this.renderError(`Please upgrade your Maslow Due firmware (${MASLOW_MIN_FIRMWARE_DUE} or later).`, false, true);
            }
            if (fv < MASLOW_CUR_FIRMWARE_DUE) {
                banner = this.renderError('There is an update available for your Maslow Due firmware.', false, true);
            }
        } else {
            return this.renderError(
                <span>
                    {fn + 'is not a Maslow.'}
                    <br /><br />
                    {`The firmware reported it was of type ${fn}, but 'Maslow' was expected.`}
                    Please use an Arduino Due or Mega with the appropriate firmware.
                </span>, true, true
            );
        }

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
                {banner && (
                    <ToastNotification
                        style={{ marginBottom: '10px' }}
                        type="warning"
                        dismissible={false}
                    >
                        {banner}
                    </ToastNotification>
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
                        {'Problems detected with Maslow settings:'}
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
                            {Object.keys(controllerSettings.grbl).map((key) => {
                                const grbl = controllerSettings.grbl[key];
                                const name = (grbl.message && grbl.message.length > 0) ? grbl.message : grbl.name;
                                const title = `${grbl.name}: ${grbl.message}`;
                                return (
                                    <div key={key} className="row no-gutters">
                                        <div className="col col-xs-5">
                                            <div className={styles.textEllipsis} title={title}>
                                                {name}
                                            </div>
                                        </div>
                                        <div className="col col-xs-4">
                                            <input
                                                type="text"
                                                className={styles.setting}
                                                value={ _.has(settingsEdits, key) ? settingsEdits[key] : grbl.value}
                                                onChange={(e) => {
                                                    this.setState({
                                                        settingsEdits: {
                                                            ...settingsEdits,
                                                            [key]: e.target.value
                                                        }
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col col-xs-1" style={{ textAlign: 'right', fontStyle: 'italic', fontSize: '-2em' }}>
                                            {grbl.units}
                                        </div>
                                        <div className="col col-xs-2" style={{ textAlign: 'right' }}>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-default"
                                                onClick={() => {
                                                    this.saveSetting(key);
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
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Edition')}>
                                        {i18n._('Edition')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {fn}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Version')}>
                                        {i18n._('Version')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {fv}
                                    </div>
                                </div>
                            </div>
                            <div className="row no-gutters">
                                <div className="col col-xs-4">
                                    <div className={styles.textEllipsis} title={i18n._('Protocol')}>
                                        {i18n._('Protocol')}
                                    </div>
                                </div>
                                <div className="col col-xs-8">
                                    <div className={styles.well}>
                                        {controllerSettings.protocol && controllerSettings.protocol.name}
                                        ({controllerSettings.protocol && controllerSettings.protocol.version})
                                    </div>
                                </div>
                            </div>
                        </Panel.Body>
                    )}
                </Panel>
            </div>
        );
    }
}

export default MaslowPanels;
