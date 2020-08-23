import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Workspaces from 'app/lib/workspaces';
import i18n from 'app/lib/i18n';
import styles from './index.styl';

class QuickAccessToolbar extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    command = {
        'cyclestart': () => {
            this.workspace.controller.command('cyclestart');
        },
        'feedhold': () => {
            this.workspace.controller.command('feedhold');
        },
        'homing': () => {
            this.workspace.controller.command('homing');
        },
        'sleep': () => {
            this.workspace.controller.command('sleep');
        },
        'unlock': () => {
            this.workspace.controller.command('unlock');
        },
        'reset': () => {
            this.workspace.controller.command('reset');
        }
    };

    render() {
        return (
            <div className={styles.quickAccessToolbar}>
                <ul className="nav navbar-nav">
                    <li className="btn-group btn-group-sm" role="group">
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={this.command.cyclestart}
                            title={i18n._('Cycle Start')}
                        >
                            <i className="fa fa-repeat" />
                            <Space width="8" />
                            {i18n._('Cycle Start')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={this.command.feedhold}
                            title={i18n._('Feedhold')}
                        >
                            <i className="fa fa-hand-paper-o" />
                            <Space width="8" />
                            {i18n._('Feedhold')}
                        </button>
                    </li>
                    <li className="btn-group btn-group-sm" role="group">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.command.homing}
                            title={i18n._('Set current position as machine home')}
                        >
                            {i18n._('Set Home')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={this.command.sleep}
                            title={i18n._('Sleep')}
                        >
                            <i className="fa fa-bed" />
                            <Space width="8" />
                            {i18n._('Sleep')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={this.command.unlock}
                            title={i18n._('Clear system alarm')}
                        >
                            <i className="fa fa-unlock-alt" />
                            <Space width="8" />
                            {i18n._('Unlock')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={this.command.reset}
                            title={i18n._('Reset board connection')}
                        >
                            <i className="fa fa-undo" />
                            <Space width="8" />
                            {i18n._('Reset')}
                        </button>
                    </li>
                </ul>
            </div>
        );
    }
}

export default QuickAccessToolbar;
