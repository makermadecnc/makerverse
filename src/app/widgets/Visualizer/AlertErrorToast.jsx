import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { ToastNotification } from 'app/components/Notifications';
import Workspaces from 'app/lib/workspaces';

class AlertErrorToast extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        onDismiss: PropTypes.func,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    state = {
        error: null,
        alarm: null,
    };

    controllerEvents = {
        'controller:state': (type, controllerState) => {
            this.setState({
                error: controllerState.status.error,
                alarm: controllerState.status.alarm,
            });
        }
    };

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
    }

    componentWillUnmount() {
        this.workspace.removeControllerEvents(this.controllerEvents);
    }

    render() {
        const { error, alarm } = this.state;

        return (
            <div>
                {alarm && (
                    <ToastNotification type="error">
                        <div>
                            <div><strong>{alarm.message}</strong></div>
                            <div>{alarm.description}</div>
                        </div>
                    </ToastNotification>
                )}
                {error && (
                    <ToastNotification type="warning">
                        <div>
                            <div><strong>{error.message}</strong></div>
                            <div>{error.description}</div>
                        </div>
                    </ToastNotification>
                )}
            </div>
        );
    }
}

export default AlertErrorToast;
