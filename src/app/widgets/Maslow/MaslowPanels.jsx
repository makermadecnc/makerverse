import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ProgressBar } from 'react-bootstrap';
import mapGCodeToText from 'app/lib/gcode-text';
import i18n from 'app/lib/i18n';
import Panel from 'app/components/Panel';
import Toggler from 'app/components/Toggler';
import Space from 'app/components/Space';
import styles from './index.styl';
import {
    MODAL_CALIBRATION
} from './constants';

class MaslowPanels extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    // https://github.com/grbl/grbl/wiki/Interfacing-with-Grbl
    // Grbl v0.9: BLOCK_BUFFER_SIZE (18), RX_BUFFER_SIZE (128)
    // Grbl v1.1: BLOCK_BUFFER_SIZE (16), RX_BUFFER_SIZE (128)
    plannerBufferMax = 0;

    plannerBufferMin = 0;

    receiveBufferMax = 128;

    receiveBufferMin = 0;

    render() {
        const { state, actions } = this.props;
        const none = '–';
        const panel = state.panel;
        const controllerState = state.controller.state || {};
        const controllerSettings = state.controller.settings || {};
        const parserState = _.get(controllerState, 'parserstate', {});
        const activeState = _.get(controllerState, 'status.activeState') || none;
        const feedrate = _.get(controllerState, 'status.feedrate', _.get(parserState, 'feedrate', none));
        const spindle = _.get(controllerState, 'status.spindle', _.get(parserState, 'spindle', none));
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

        const fv = controllerSettings.firmware ? (Number(controllerSettings.firmware.version) || 0) : 0;
        const fn = controllerSettings.firmware ? controllerSettings.firmware.name : null;

        if (!fn || fn.length <= 0) {
            return (
                <div className={styles.noConnection}>
                    No compatible device detected.
                    <br />
                    For Maslows using the Mega board, upgrade to Holey firmware (v51.28 or later).
                    For Maslows using the Due board,
                </div>
            );
        }

        if (fn === 'MaslowClassic') {
            if (fv < 51.28) {
                return <div className={styles.noConnection}>Please upgrade to Holey firmware (51.28 or later).</div>;
            }
        } else if (fn === 'MaslowDue') {
            if (fv < 20200811) {
                return <div className={styles.noConnection}>Please upgrade your Maslow Due firmware (20200811 or later).</div>;
            }
        } else {
            return (
                <div className={styles.noConnection}>
                    {fn + ' is not a Maslow.'}
                </div>
            );
        }

        return (
            <div>
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
                            {Object.keys(controllerSettings.grbl).map((key) => {
                                const val = controllerSettings.grbl[key];
                                const name = (val.message && val.message.length > 0) ? val.message : val.name;
                                const title = `${val.name}: ${val.message}`;
                                return (
                                    <div key={key} className="row no-gutters">
                                        <div className="col col-xs-8">
                                            <div className={styles.textEllipsis} title={title}>
                                                {name}
                                            </div>
                                        </div>
                                        <div className="col col-xs-4">
                                            <div className={styles.well}>
                                                {val.value}
                                            </div>
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
                <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => {
                        actions.openModal(MODAL_CALIBRATION);
                    }}
                    title={i18n._('Calibrate')}
                >
                    <i className="fa fa-bullseye" />
                    <Space width="8" />
                    {i18n._('Calibrate')}
                </button>
            </div>
        );
    }
}

export default MaslowPanels;
