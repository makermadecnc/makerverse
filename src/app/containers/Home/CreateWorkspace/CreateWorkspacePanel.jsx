import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import log from 'js-logger';
import { Grid, Paper } from '@material-ui/core';
import CustomizeMachine from '@openworkshop/ui/components/MachineProfiles/CustomizeMachine';
import PoweredBy from '@openworkshop/ui/components/Brand/PoweredBy';
import { ToastNotification } from 'app/components/Notifications';
import { controllerTypeToConst } from 'app/constants';
import settings from 'app/config/settings';
import i18n from 'app/lib/i18n';
import ConnectedHardware from './ConnectedHardware';
import CustomizeWorkspace from './CustomizeWorkspace';
import Connection, { ConnectionStatusType } from './Connection';

class CreateWorkspacePanel extends PureComponent {
    static propTypes = {
        connectionStatus: ConnectionStatusType,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    state = { customizedMachine: null };

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
        if (!this.props.workspaceSettings || !this.props.workspaceSettings.firmware) {
            return null;
        }

        const actions = this.props.actions;
        if (connectionStatus.connected) {
            return (
                <ConnectedHardware
                    actions={actions}
                    connectionStatus={connectionStatus}
                    requiredFirmware={this.props.workspaceSettings.firmware}
                />
            );
        }
        return (
            <Connection
                actions={actions}
                connectionStatus={connectionStatus}
                disabled={disabled || connectionStatus.loadingPorts}
                handleOpenPort={this.handleOpenPort}
                handleRefreshPorts={actions.handleRefreshPorts}
                isLoading={isLoading}
            />
        );
    }

    onCustomized = (customizedMachine) => {
        log.debug('customized machine', customizedMachine);
        if (!customizedMachine) {
            this.props.actions.updateWorkspace({});
            return;
        }
        const workspaceSettings = _.cloneDeep(customizedMachine);
        workspaceSettings.firmware.controllerType = controllerTypeToConst(workspaceSettings.firmware.controllerType);
        this.props.actions.updateWorkspace(workspaceSettings);
    };

    render() {
        const { connectionStatus, alertMessage, workspaceSettings } = this.props;
        const isLoading = connectionStatus.connecting;
        const hasMachine = workspaceSettings && workspaceSettings.firmware;
        const connectionActive = connectionStatus.connected || connectionStatus.connecting;
        const showCustomizer = !hasMachine || !connectionActive;
        // Make sure it doesn't lose state by just hiding it:
        const custStyl = showCustomizer ? {} : { display: 'none' };

        const tip = (
            <span>
                {i18n._('Most CNC and 3D printing machines are supported, even if they are not in the community catalog.')}
                <br />
                {i18n._('Once you select a machine, you will be able to connect to it.')}
            </span>
        );

        return (
            <Grid container>
                <Grid item xs={12} style={custStyl}>
                    <CustomizeMachine
                        tip={tip}
                        onCustomized={this.onCustomized}
                    />
                </Grid>
                {hasMachine && (
                    <Grid item xs={12}>
                        <Paper style={{ padding: 20, marginBottom: 10 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    {this.renderAlert(alertMessage)}
                                    {this.renderConnectionWidget(isLoading, isLoading, connectionStatus)}
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {connectionStatus.connected && (
                                        <CustomizeWorkspace
                                            actions={this.props.actions}
                                            connectionStatus={connectionStatus}
                                            workspaceSettings={workspaceSettings}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <PoweredBy productName={settings.productName} />
                </Grid>
            </Grid>
        );
    }
}

export default CreateWorkspacePanel;
