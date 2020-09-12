import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Workspaces from 'app/lib/workspaces';
import ActiveState from 'app/lib/active-state';
import i18n from 'app/lib/i18n';
import styles from './index.styl';

class ControllerStatusBadge extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        controller: PropTypes.object.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    render() {
        const { controller } = this.props;
        const controllerType = controller.type;
        const controllerState = controller.state;
        const activeState = new ActiveState(controllerType, controllerState);
        const stateStyle = activeState.stateStyle;
        const stateText = i18n._(activeState.stateKey, { ns: 'controller' });

        if (!stateStyle || !activeState.stateKey || stateText === 'undefined') {
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
