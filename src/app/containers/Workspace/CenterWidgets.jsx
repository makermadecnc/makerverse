import classNames from 'classnames';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Widget from './Widget';
import Workspaces from '../../lib/workspaces';
import styles from './widgets.styl';

class CenterWidgets extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    render() {
        const { className } = this.props;
        const widgets = this.workspace.centerWidgets.map(widgetId => (
            <div data-widget-id={widgetId} key={widgetId}>
                <Widget
                    workspaceId={this.workspace.id}
                    widgetId={widgetId}
                />
            </div>
        ));

        return (
            <div className={classNames(className, styles.widgets)}>
                {widgets}
            </div>
        );
    }
}

export default CenterWidgets;
