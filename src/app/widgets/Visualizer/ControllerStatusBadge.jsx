import _ from 'lodash';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Workspaces from 'app/lib/workspaces';
import i18n from 'app/lib/i18n';
import {
    // Grbl
    GRBL,
    GRBL_ACTIVE_STATE_IDLE,
    GRBL_ACTIVE_STATE_RUN,
    GRBL_ACTIVE_STATE_HOLD,
    GRBL_ACTIVE_STATE_DOOR,
    GRBL_ACTIVE_STATE_HOME,
    GRBL_ACTIVE_STATE_SLEEP,
    GRBL_ACTIVE_STATE_ALARM,
    GRBL_ACTIVE_STATE_CHECK,
    // Others
    MASLOW,
} from 'app/constants';
import styles from './index.styl';

class ControllerStatusBadge extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        controller: PropTypes.object.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    getGrblStateStyle(activeState) {
        switch (activeState) {
        case GRBL_ACTIVE_STATE_IDLE: return 'controller-state-default';
        case GRBL_ACTIVE_STATE_RUN: return 'controller-state-primary';
        case GRBL_ACTIVE_STATE_HOLD: return 'controller-state-warning';
        case GRBL_ACTIVE_STATE_DOOR: return 'controller-state-warning';
        case GRBL_ACTIVE_STATE_HOME: return 'controller-state-primary';
        case GRBL_ACTIVE_STATE_SLEEP: return 'controller-state-success';
        case GRBL_ACTIVE_STATE_ALARM: return 'controller-state-danger';
        case GRBL_ACTIVE_STATE_CHECK: return 'controller-state-info';
        default: return 'controller-state-info';
        }
    }

    getGrblStateText(activeState) {
        switch (activeState) {
        case GRBL_ACTIVE_STATE_IDLE: return i18n._('idle', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_RUN: return i18n._('run', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_HOLD: return i18n._('hold', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_DOOR: return i18n._('door', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_HOME: return i18n._('home', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_SLEEP: return i18n._('sleep', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_ALARM: return i18n._('alarm', { ns: 'controller' });
        case GRBL_ACTIVE_STATE_CHECK: return i18n._('check', { ns: 'controller' });
        default: return i18n._('idle', { ns: 'controller' });
        }
    }

    render() {
        const { controller } = this.props;
        const controllerType = controller.type;
        const controllerState = controller.state;
        let stateStyle = null;
        let stateText = null;

        if (controllerType === GRBL || controllerType === MASLOW) {
            const activeState = _.get(controllerState, 'status.activeState');

            stateStyle = this.getGrblStateStyle(activeState);
            stateText = this.getGrblStateText(activeState);
        }

        if (!stateStyle || !stateText) {
            return <div />;
        }

        return (
            <div
                className={classNames(
                    styles.controllerState,
                    styles[stateStyle]
                )}
            >
                {stateText}
            </div>
        );
    }
}

export default ControllerStatusBadge;
