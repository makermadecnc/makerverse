import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Workspaces from 'app/lib/workspaces';
import { ToastNotification } from 'app/components/Notifications';
import i18n from 'app/lib/i18n';
import styles from './index.styl';

class Connection extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    render() {
        const { state, actions } = this.props;
        const { connecting, connected, alertMessage } = state;
        const controllerConfig = this.workspace._record.controller;
        const port = controllerConfig.port;
        const baudrate = controllerConfig.baudRate;
        const canOpenPort = port && baudrate && !connecting && !connected;

        return (
            <div>
                {alertMessage && (
                    <ToastNotification
                        style={{ margin: '-10px -10px 10px -10px' }}
                        type="error"
                        onDismiss={actions.clearAlert}
                    >
                        {alertMessage}
                    </ToastNotification>
                )}
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Controller')}>
                            {i18n._('Controller')}
                        </div>
                    </div>
                    <div className="col col-xs-8">
                        <div className={styles.well} title={controllerConfig.controllerType}>
                            {controllerConfig.controllerType}
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Port')}>
                            {i18n._('Port')}
                        </div>
                    </div>
                    <div className="col col-xs-8">
                        <div className={styles.well} title={port}>
                            {port}
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Baud Rate')}>
                            {i18n._('Baud Rate')}
                        </div>
                    </div>
                    <div className="col col-xs-8">
                        <div className={styles.well} title={baudrate}>
                            {baudrate}
                        </div>
                    </div>
                </div>
                <div className="btn-group btn-group-sm">
                    {!connected && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!canOpenPort}
                            onClick={actions.handleOpenPort}
                            title="Open connection to control board"
                        >
                            <i className="fa fa-toggle-off" />
                            <Space width="8" />
                            {i18n._('Open')}
                        </button>
                    )}
                    {connected && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={actions.handleClosePort}
                            title="Close connection to control board"
                        >
                            <i className="fa fa-toggle-on" />
                            <Space width="8" />
                            {i18n._('Close')}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Connection;
