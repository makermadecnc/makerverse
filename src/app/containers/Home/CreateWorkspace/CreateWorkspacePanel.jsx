import _ from 'lodash';
import PropTypes from 'prop-types';
import log from 'js-logger';
import cx from 'classnames';
import React, { PureComponent } from 'react';
import i18n from 'app/lib/i18n';
import analytics from 'app/lib/analytics';
import Workspaces from 'app/lib/workspaces';
import { ToastNotification } from 'app/components/Notifications';
import { fetchMachineProfiles } from 'app/lib/ows/machines';
import ChooseMachine from './ChooseMachine';
import CustomMachine from './CustomMachine';
import ConnectedHardware from './ConnectedHardware';
import Connection, { ConnectionStatusType } from './Connection';
import CustomizeWorkspace from './CustomizeWorkspace';
import styles from './index.styl';

class CreateWorkspacePanel extends PureComponent {
    static propTypes = {
        connectionStatus: ConnectionStatusType,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    state = { machineProfiles: null, isCustomMachine: false, fetchBegan: false };

    fetchMachineProfiles() {
        this.setState({ fetchBegan: true });
        fetchMachineProfiles().then((res) => {
            this.setState({ machineProfiles: res });
        }).catch((err) => {
            this.setState({ machineProfiles: [] });
        });
    }

    onSelectedCustomMachine = (firmware, customMachine) => {
        const workspaceSettings = {
            ...this.props.workspaceSettings,
            name: customMachine.model,
            icon: Workspaces.getControllerTypeIconName(firmware.controllerType),
            customMachine: customMachine,
            firmware: firmware,
            parts: [],
            axes: this.props.actions.getAxisMap([], this.props.workspaceSettings.axes),
            // features: [],
        };
        delete workspaceSettings.machineProfileId;
        this.props.actions.updateWorkspace(workspaceSettings);
    };

    // When firmware is provided by a machine profile, select one from the list...
    selectFirmware = (firmwareList, idx) => {
        const firmware = firmwareList[idx];
        const controllerType = firmware.controllerType.toLowerCase();
        this.props.connectionStatus.controller.loadedControllers.forEach((ct) => {
            // Controller types are case
            if (controllerType === ct.toLowerCase()) {
                firmware.controllerType = ct;
            }
        });
        return firmware;
    };

    onSelectedMachineProfileAndParts = (machineProfileId, machinePartIds) => {
        if (!machinePartIds) {
            this.props.actions.updateWorkspace({});
            return;
        }

        const partTypeCount = Object.keys(machinePartIds).length;
        const profile = _.find(this.state.machineProfiles, { id: machineProfileId });
        const parts = _.filter(profile.parts, p => machinePartIds[p.partType] === p.id);
        if (parts.length !== partTypeCount) {
            log.error('Could not find', (partTypeCount - parts.length), 'parts');
        }
        const actions = this.props.actions;
        log.debug('machine profile', profile, 'and', partTypeCount, 'parts', parts);

        const workspaceSettings = {
            ...this.props.workspaceSettings,
            machineProfileId: profile.id,
            name: profile.name,
            icon: profile.icon,
            firmware: this.selectFirmware(profile.firmware, 0), // ChooseMachine guarantees len == 1
            parts: parts,
            axes: actions.getAxisMap(profile.axes),
            features: actions.packFeatures(profile.features),
        };
        delete workspaceSettings.customMachine;
        actions.updateWorkspace(workspaceSettings);
    };

    handleOpenPort = (port) => {
        const firmware = this.props.workspaceSettings.firmware;
        firmware.port = port;
        this.props.actions.handleOpenPort(firmware);

        const workspaceSettings = {
            ...this.props.workspaceSettings,
            firmware: {
                ...firmware,
            }
        };
        this.props.actions.updateWorkspace(workspaceSettings);
    };

    renderAlert = (alertMessage) => {
        if (!alertMessage) {
            return <span />;
        }
        return (
            <ToastNotification type="error" onDismiss={this.props.actions.clearAlert}>
                {alertMessage}
            </ToastNotification>
        );
    };

    renderConnectionWidget = (disabled, isLoading, connectionStatus) => {
        const actions = this.props.actions;
        if (connectionStatus.connected) {
            return (<ConnectedHardware
                actions={actions}
                connectionStatus={connectionStatus}
                requiredFirmware={this.props.workspaceSettings.firmware}
            />);
        }
        return <Connection
            actions={actions}
            connectionStatus={connectionStatus}
            disabled={disabled || connectionStatus.loadingPorts}
            handleOpenPort={this.handleOpenPort}
            handleRefreshPorts={actions.handleRefreshPorts}
            isLoading={isLoading}
        />;
    }

    render() {
        const { isCustomMachine, machineProfiles, fetchBegan } = this.state;
        const { connectionStatus, alertMessage } = this.props;
        const { firmware, customMachine, machineProfileId } = this.props.workspaceSettings;
        const { baudRate, controllerType } = firmware || {};

        const hasCustomMachine = !!(isCustomMachine && customMachine &&
            customMachine.brand.length && customMachine.model.length);
        const hasMachineProfile = !isCustomMachine && machineProfileId;
        const hasMachine = hasMachineProfile || hasCustomMachine;

        const isLoadingMachineProfiles = !machineProfiles;
        const isLoading = connectionStatus.connecting || isLoadingMachineProfiles;
        const disabled = isLoading;
        const canUseConnection = controllerType && baudRate && hasMachine;
        const canSwitchMachineMode = !canUseConnection;

        const sw1 = isCustomMachine ? i18n._('Not sure what settings to use?')
            : i18n._('Can\'t find your machine?');
        const sw2 = isCustomMachine ? i18n._('Search the Community Catalog')
            : i18n._('Create a New Machine');

        if (!fetchBegan) {
            return (
                <div className={styles.widgetEmpty} >
                    <button
                        className="btn btn-lg btn-primary"
                        onClick={() => this.fetchMachineProfiles()}
                    >
                        {i18n._('Connect to a New Machine')}
                    </button>
                </div>
            );
        }

        return (
            <div className="container-fluid" style={{ padding: 0, margin: -10 }} >
                <div className="row" style={{ padding: 0, margin: 0 }}>
                    <div className={ cx('col-lg-6', styles.widgetLeft) } >
                        {!isCustomMachine && <ChooseMachine
                            onSelectedMachineProfileAndParts={this.onSelectedMachineProfileAndParts}
                            machineProfiles={machineProfiles}
                            bkColor={this.props.bkColor}
                        />}
                        {isCustomMachine && <CustomMachine
                            controller={connectionStatus.controller}
                            onSelected={this.onSelectedCustomMachine}
                            disabled={disabled}
                            bkColor={this.props.bkColor}
                        />}
                        <div
                            className={
                                cx('container-fluid', styles.widgetFooter)
                            }
                            style={{ textAlign: 'center' }}
                        >
                            <div className="row">
                                <div className="col-lg-3" />
                                <div
                                    className="col-lg-6"
                                >
                                    {this.renderAlert(alertMessage)}
                                    {canSwitchMachineMode && (
                                        <div>
                                            <i>{sw1}</i>
                                            <br />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-default"
                                                onClick={() => {
                                                    this.setState({
                                                        isCustomMachine: !isCustomMachine
                                                    });
                                                }}
                                                disabled={!!disabled}
                                            >
                                                {sw2}
                                            </button>
                                            <br />
                                            <br />
                                            <i>
                                                Makerverse can support almost any machine (
                                                <analytics.OutboundLink
                                                    eventLabel="machines"
                                                    to="http://www.makerverse.com/machines/"
                                                    target="_blank"
                                                >
                                                    {i18n._('learn more')}
                                                </analytics.OutboundLink>).
                                            </i>
                                        </div>
                                    )}
                                    {canUseConnection && this.renderConnectionWidget(
                                        disabled, isLoading, connectionStatus)}
                                </div>
                                <div className="col-lg-3" />
                            </div>
                        </div>
                    </div>
                    <div className={ cx('h-100', 'col-lg-6', styles.widgetRight) }>
                        <CustomizeWorkspace
                            actions={this.props.actions}
                            connectionStatus={connectionStatus}
                            createError={this.props.createError}
                            creating={this.props.creating}
                            workspaceSettings={this.props.workspaceSettings}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateWorkspacePanel;
