import classNames from 'classnames';
import pick from 'lodash/pick';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import Space from 'app/components/Space';
import i18n from 'app/lib/i18n';
import Workspaces from 'app/lib/workspaces';
import { Tooltip } from 'app/components/Tooltip';
import log from 'app/lib/log';
import analytics from 'app/lib/analytics';
import {
    // Workflow
    WORKFLOW_STATE_IDLE,
    WORKFLOW_STATE_PAUSED,
    WORKFLOW_STATE_RUNNING
} from '../../constants';
import {
    MODAL_WATCH_DIRECTORY
} from './constants';
import styles from './workflow-control.styl';
import AlertErrorToast from './AlertErrorToast';

class WorkflowControl extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    fileInputEl = null;

    handleClickUpload = (event) => {
        this.fileInputEl.value = null;
        this.fileInputEl.click();
    };

    event(opts) {
        analytics.event({
            ...opts,
            category: 'interaction',
            action: 'workflow',
        });
    }

    command = {
        'homing': () => {
            this.workspace.controller.command('homing');
            this.event({ label: 'homing' });
        },
        'sleep': () => {
            this.workspace.controller.command('sleep');
            this.event({ label: 'sleep' });
        },
        'unlock': () => {
            this.workspace.controller.command('unlock');
            this.event({ label: 'unlock' });
        },
        'cyclestart': () => {
            if (this.canRun) {
                this.props.actions.handleRun();
                return;
            }
            this.workspace.controller.command('cyclestart');
            this.event({ label: 'cyclestart' });
        },
        'feedhold': () => {
            if (this.isWorkflowRunning) {
                this.props.actions.handlePause();
                return;
            }
            this.workspace.controller.command('feedhold');
            this.event({ label: 'feedhold' });
        },
        'reset': () => {
            this.workspace.controller.command('reset');
            this.event({ label: 'reset' });
        },
        'stop': () => {
            this.props.actions.handleStop();
        },
        'unload': () => {
            this.props.actions.handleClose();
        },
    };

    handleChangeFile = (event) => {
        const { actions } = this.props;
        const files = event.target.files;
        const file = files[0];
        const reader = new FileReader();

        reader.onloadend = (event) => {
            const { result, error } = event.target;

            if (error) {
                log.error(error);
                return;
            }

            log.debug('FileReader:', pick(file, [
                'lastModified',
                'lastModifiedDate',
                'meta',
                'name',
                'size',
                'type'
            ]));

            const meta = {
                name: file.name,
                size: file.size
            };
            actions.uploadFile(result, meta);
        };

        try {
            reader.readAsText(file);
        } catch (err) {
            // Ignore error
        }
    };


    renderButtonFeature(key, title, desc, icon, btnType, disabled) {
        const feature = this.workspace.getFeature(key, { title: title, description: desc || title, icon: icon });
        btnType = disabled ? 'default' : btnType;
        return !feature ? '' : (
            <Tooltip
                placement="bottom"
                style={{ color: '#fff' }}
                content={i18n._(feature.description)}
                disabled={!!disabled}
            >
                <button
                    type="button"
                    className={'btn btn-sm btn-' + btnType}
                    style={{ lineHeight: '18px' }}
                    onClick={this.command[key]}
                    disabled={!!disabled}
                >
                    {feature.icon && <i className={'fa ' + feature.icon} />}
                    {feature.icon && feature.title && <Space width="8" />}
                    {feature.title && i18n._(feature.title)}
                </button>
            </Tooltip>
        );
    }

    get hasGcode() {
        return !!(this.props.state.port && this.props.state.gcode.ready);
    }

    get canRun() {
        if (!this.hasGcode) {
            return false;
        }

        const workflow = this.props.state.workflow;
        if (workflow.state === WORKFLOW_STATE_PAUSED) {
            return this.workspace.activeState.isPaused || this.workspace.activeState.isReady;
        }
        if (workflow.state === WORKFLOW_STATE_IDLE) {
            return this.workspace.activeState.isReady;
        }

        return false;
    }


    get isWorkflowPaused() {
        return this.hasGcode && this.props.state.workflow.state === WORKFLOW_STATE_PAUSED;
    }

    get isWorkflowRunning() {
        return this.hasGcode && this.props.state.workflow.state === WORKFLOW_STATE_RUNNING;
    }

    get isWorkflowIdle() {
        return this.hasGcode && this.props.state.workflow.state === WORKFLOW_STATE_IDLE;
    }

    render() {
        const { state, actions } = this.props;
        const { controller } = state;
        const activeState = this.workspace.activeState;
        activeState.updateControllerState(controller.state);

        const isRunningWorkflow = this.isWorkflowRunning;
        const hasPausedWorkflow = this.isWorkflowPaused;
        const isWorkflowActive = hasPausedWorkflow || isRunningWorkflow;
        const canClose = this.isWorkflowIdle;
        const hasError = !!activeState.error;
        const isPaused = hasPausedWorkflow || activeState.isPaused;
        const canPause = isRunningWorkflow || activeState.isRunning;
        const canPlay = this.canRun || activeState.isPaused;
        const playPauseText = isPaused ? 'Resume (Cycle Start)' : 'Run Program';

        return (
            <div className={styles.workflowControl}>
                <input
                    // The ref attribute adds a reference to the component to
                    // this.refs when the component is mounted.
                    ref={(node) => {
                        this.fileInputEl = node;
                    }}
                    type="file"
                    style={{ display: 'none' }}
                    multiple={false}
                    onChange={this.handleChangeFile}
                />
                <div className="btn-toolbar">
                    <div className="btn-group btn-group-sm">
                        <button
                            type="button"
                            className="btn btn-primary"
                            title={i18n._('Uplload Program')}
                            onClick={this.handleClickUpload}
                        >
                            {i18n._('Upload Program')}
                        </button>
                        <Dropdown
                            id="upload-dropdown"
                        >
                            <Dropdown.Toggle
                                bsStyle="primary"
                                noCaret
                            >
                                <i className="fa fa-caret-down" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <MenuItem header>
                                    {i18n._('Watch Directory')}
                                </MenuItem>
                                <MenuItem
                                    onSelect={() => {
                                        actions.openModal(MODAL_WATCH_DIRECTORY);
                                    }}
                                >
                                    <i className="fa fa-search" />
                                    <Space width="4" />
                                    {i18n._('Browse...')}
                                </MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="btn-group btn-group-sm">
                        {this.renderButtonFeature('cyclestart', null, playPauseText, 'fa-play', 'success', !canPlay)}
                        {this.renderButtonFeature('feedhold', null, 'Pause execution (feedhold)', 'fa-pause', 'warning', !canPause)}
                        {isWorkflowActive && !canClose && this.renderButtonFeature('stop', null, 'Stop program execution (progress will be lost)', 'fa-stop', 'danger', !hasPausedWorkflow)}
                        {canClose && this.renderButtonFeature('unload', null, 'Unload the current program', 'fa-trash', 'danger')}
                    </div>
                    <div className="btn-group btn-group-sm">
                        {this.renderButtonFeature('reset', 'Reset', 'Reset board connection', 'fa-plug', 'danger')}
                        {activeState.isIdle && this.renderButtonFeature('sleep', 'Sleep', 'Put machine to sleep', 'fa-bed', 'success')}
                        {(activeState.hasAlarm || hasError) && this.renderButtonFeature('unlock', 'Unlock', 'Clear system alarms and errors', 'fa-unlock-alt', 'warning')}
                    </div>
                    <div className="pull-right btn-group btn-group-sm">
                        {this.renderButtonFeature('homing', 'Set Home', 'Set current position as machine home', 'fa-home', 'primary')}
                    </div>
                    <Dropdown
                        className="hidden"
                        bsSize="sm"
                        id="toolbar-dropdown"
                        pullRight
                    >
                        <Dropdown.Toggle
                            noCaret
                            style={{
                                paddingLeft: 8,
                                paddingRight: 8
                            }}
                        >
                            <i className="fa fa-list-alt" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <MenuItem>
                                <i className={classNames(styles.icon, styles.iconPerimeterTracingSquare)} />
                                <Space width="4" />
                            </MenuItem>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <AlertErrorToast
                    workspaceId={this.workspace.id}
                />
            </div>
        );
    }
}

export default WorkflowControl;
