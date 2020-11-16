import _ from 'lodash';
import log from 'js-logger';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import pubsub from 'pubsub-js';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar } from 'components/Buttons';
import api from 'api';
import {
    WORKFLOW_STATE_IDLE
} from 'constants/index';
import i18n from 'lib/i18n';
import store from 'store';
import analytics from 'lib/analytics';
import * as widgetManager from './WidgetManager';
import CenterWidgets from './CenterWidgets';
import PrimaryWidgets from './PrimaryWidgets';
import SecondaryWidgets from './SecondaryWidgets';
import FeederPaused from './modals/FeederPaused';
import FeederWait from './modals/FeederWait';
import ServerDisconnected from './modals/ServerDisconnected';
import styles from './index.styl';
import Workspaces from '../../lib/workspaces';
import {
    MODAL_NONE,
    MODAL_FEEDER_PAUSED,
    MODAL_FEEDER_WAIT,
    MODAL_SERVER_DISCONNECTED
} from './constants';

const WAIT = '%wait';

const startWaiting = () => {
    // Adds the 'wait' class to <html>
    const root = document.documentElement;
    root.classList.add('wait');
};
const stopWaiting = () => {
    // Adds the 'wait' class to <html>
    const root = document.documentElement;
    root.classList.remove('wait');
};

class Workspace extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes,
        workspaceId: PropTypes.string.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    state = {
        mounted: false,
        port: '',
        blockingText: '',
        modal: {
            name: MODAL_NONE,
            params: {}
        },
        isDraggingFile: false,
        isDraggingWidget: false,
        isUploading: false,
        showPrimaryContainer: this.workspace.primaryWidgetsVisible,
        showSecondaryContainer: this.workspace.secondaryWidgetsVisible,
        inactiveCount: _.size(this.workspace.inactiveWidgetTypes)
    };

    action = {
        openModal: (name = MODAL_NONE, params = {}) => {
            if (name !== MODAL_NONE) {
                analytics.modalview(name);
            }
            this.setState(state => ({
                modal: {
                    name: name,
                    params: params
                }
            }));
        },
        closeModal: () => {
            this.setState(state => ({
                modal: {
                    name: MODAL_NONE,
                    params: {}
                }
            }));
        },
        updateModalParams: (params = {}) => {
            this.setState(state => ({
                modal: {
                    ...state.modal,
                    params: {
                        ...state.modal.params,
                        ...params
                    }
                }
            }));
        }
    };

    sortableGroup = {
        primary: null,
        secondary: null
    };

    primaryContainer = null;

    secondaryContainer = null;

    primaryToggler = null;

    secondaryToggler = null;

    primaryWidgets = null;

    secondaryWidgets = null;

    defaultContainer = null;

    controllerEvents = {
        'connect': () => {
            if (this.workspace.controller.connected) {
                this.action.closeModal();
            } else {
                this.action.openModal(MODAL_SERVER_DISCONNECTED);
            }
        },
        'connect_error': () => {
            if (this.workspace.controller.connected) {
                this.action.closeModal();
            } else {
                this.action.openModal(MODAL_SERVER_DISCONNECTED);
            }
        },
        'disconnect': () => {
            if (this.workspace.controller.connected) {
                this.action.closeModal();
            } else {
                this.action.openModal(MODAL_SERVER_DISCONNECTED);
            }
        },
        'serialport:open': (options) => {
            const { port } = options;
            this.setState({ port: port });
        },
        'serialport:close': (options) => {
            this.setState({ port: '' });
        },
        'feeder:status': (status) => {
            const { modal } = this.state;
            const { hold, holdReason } = { ...status };

            if (!hold) {
                if (_.includes([MODAL_FEEDER_PAUSED, MODAL_FEEDER_WAIT], modal.name)) {
                    this.action.closeModal();
                }
                return;
            }

            const { err, data } = { ...holdReason };

            if (err) {
                this.action.openModal(MODAL_FEEDER_PAUSED, {
                    title: i18n._('Error')
                });
                return;
            }

            if (data === WAIT) {
                this.action.openModal(MODAL_FEEDER_WAIT, {
                    title: '%wait'
                });
                return;
            }

            const title = {
                'M0': i18n._('M0 Program Pause'),
                'M1': i18n._('M1 Program Pause'),
                'M2': i18n._('M2 Program End'),
                'M30': i18n._('M30 Program End'),
                'M6': i18n._('M6 Tool Change'),
                'M109': i18n._('M109 Set Extruder Temperature'),
                'M190': i18n._('M190 Set Heated Bed Temperature')
            }[data] || data;

            this.action.openModal(MODAL_FEEDER_PAUSED, {
                title: title
            });
        }
    };

    widgetEventHandler = {
        onForkWidget: (widgetId) => {
            // TODO
        },
        onRemoveWidget: (widgetId) => {
            const inactiveWidgetTypes = this.workspace.inactiveWidgetTypes;
            this.setState({ inactiveCount: inactiveWidgetTypes.length });
        },
        onDragStart: () => {
            const { isDraggingWidget } = this.state;
            if (!isDraggingWidget) {
                this.setState({ isDraggingWidget: true });
            }
        },
        onDragEnd: () => {
            const { isDraggingWidget } = this.state;
            if (isDraggingWidget) {
                this.setState({ isDraggingWidget: false });
            }
        }
    };

    togglePrimaryContainer = () => {
        const { showPrimaryContainer } = this.state;
        this.setState({ showPrimaryContainer: !showPrimaryContainer });

        // Publish a 'resize' event
        pubsub.publish('resize'); // Also see "widgets/Visualizer"
    };

    toggleSecondaryContainer = () => {
        const { showSecondaryContainer } = this.state;
        this.setState({ showSecondaryContainer: !showSecondaryContainer });

        // Publish a 'resize' event
        pubsub.publish('resize'); // Also see "widgets/Visualizer"
    };

    resizeDefaultContainer = () => {
        const sidebar = document.querySelector('#sidebar');
        const primaryContainer = ReactDOM.findDOMNode(this.primaryContainer);
        const secondaryContainer = ReactDOM.findDOMNode(this.secondaryContainer);
        const primaryToggler = ReactDOM.findDOMNode(this.primaryToggler);
        const secondaryToggler = ReactDOM.findDOMNode(this.secondaryToggler);
        const defaultContainer = ReactDOM.findDOMNode(this.defaultContainer);
        const { showPrimaryContainer, showSecondaryContainer } = this.state;

        { // Mobile-Friendly View
            const { location } = this.props;
            const disableHorizontalScroll = !(showPrimaryContainer && showSecondaryContainer);

            if (location.pathname === this.workspace.path && disableHorizontalScroll) {
                // Disable horizontal scroll
                document.body.scrollLeft = 0;
                document.body.style.overflowX = 'hidden';
            } else {
                // Enable horizontal scroll
                document.body.style.overflowX = '';
            }
        }

        if (showPrimaryContainer) {
            defaultContainer.style.left = primaryContainer.offsetWidth + sidebar.offsetWidth + 'px';
        } else {
            defaultContainer.style.left = primaryToggler.offsetWidth + sidebar.offsetWidth + 'px';
        }

        if (showSecondaryContainer) {
            defaultContainer.style.right = secondaryContainer.offsetWidth + 'px';
        } else {
            defaultContainer.style.right = secondaryToggler.offsetWidth + 'px';
        }

        // Publish a 'resize' event
        pubsub.publish('resize'); // Also see "widgets/Visualizer"
    };

    onDrop = (files) => {
        const { port } = this.state;

        if (!port) {
            return;
        }

        let file = files[0];
        let reader = new FileReader();

        reader.onloadend = (event) => {
            const { result, error } = event.target;

            if (error) {
                log.error(error);
                return;
            }

            log.debug('FileReader:', _.pick(file, [
                'lastModified',
                'lastModifiedDate',
                'meta',
                'name',
                'size',
                'type'
            ]));

            startWaiting();
            this.setState({ isUploading: true });

            const name = file.name;
            const gcode = result;

            api.loadGCode({ port, name, gcode })
                .then((res) => {
                    const { name = '', gcode = '' } = { ...res.body };
                    pubsub.publish('gcode:load', { name, gcode });
                })
                .catch((res) => {
                    log.error('Failed to upload G-code file');
                })
                .then(() => {
                    stopWaiting();
                    this.setState({ isUploading: false });
                });
        };

        try {
            reader.readAsText(file);
        } catch (err) {
            // Ignore error
        }
    };

    updateWidgetsForSecondaryContainer = () => {
        widgetManager.show(this.workspace.id, (activeWidgets, inactiveWidgets) => {
            const widgets = Object.keys(store.get('widgets', {}))
                .filter(widgetId => {
                    const name = widgetId.split(':')[0];
                    return _.includes(activeWidgets, name);
                });

            const sortableWidgets = _.difference(widgets, this.workspace.centerWidgets);
            let primaryWidgets = this.workspace.primaryWidgets;
            let secondaryWidgets = this.workspace.secondaryWidgets;

            secondaryWidgets = sortableWidgets.slice();
            _.pullAll(secondaryWidgets, primaryWidgets);
            pubsub.publish('updateSecondaryWidgets', secondaryWidgets);

            // Update inactive count
            this.setState({ inactiveCount: _.size(inactiveWidgets) });
        });
    };

    onBlockingText(text) {
        this.setState({ blockingText: text });
    }

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
        this.workspace.addListener('block', this.onBlockingText.bind(this));
        this.addResizeEventListener();

        setTimeout(() => {
            // A workaround solution to trigger componentDidUpdate on initial render
            this.setState({ mounted: true });
        }, 0);
    }

    componentWillUnmount() {
        this.workspace.removeControllerEvents(this.controllerEvents);
        this.workspace.removeListener('block', this.onBlockingText);
        this.removeResizeEventListener();
    }

    componentDidUpdate() {
        this.workspace.primaryWidgetsVisible = this.state.showPrimaryContainer;
        this.workspace.secondaryWidgetsVisible = this.state.showSecondaryContainer;

        this.resizeDefaultContainer();
    }

    addResizeEventListener() {
        this.onResizeThrottled = _.throttle(this.resizeDefaultContainer, 50);
        window.addEventListener('resize', this.onResizeThrottled);
    }

    removeResizeEventListener() {
        window.removeEventListener('resize', this.onResizeThrottled);
        this.onResizeThrottled = null;
    }

    render() {
        const { style, className } = this.props;
        const {
            port,
            modal,
            isDraggingFile,
            isDraggingWidget,
            showPrimaryContainer,
            showSecondaryContainer,
            inactiveCount
        } = this.state;
        const hidePrimaryContainer = !showPrimaryContainer;
        const hideSecondaryContainer = !showSecondaryContainer;
        const blockingText = this.workspace.blockingText;

        if (!this.workspace) {
            return <div />;
        }

        return (
            <div style={style} className={classNames(className, styles.workspace)}>
                {modal.name === MODAL_FEEDER_PAUSED && (
                    <FeederPaused
                        controller={this.workspace.controller}
                        title={modal.params.title}
                        onClose={this.action.closeModal}
                    />
                )}
                {modal.name === MODAL_FEEDER_WAIT && (
                    <FeederWait
                        controller={this.workspace.controller}
                        title={modal.params.title}
                        onClose={this.action.closeModal}
                    />
                )}
                {modal.name === MODAL_SERVER_DISCONNECTED &&
                <ServerDisconnected />
                }
                <div
                    className={classNames(
                        styles.dropzoneOverlay,
                        { [styles.hidden]: !(port && isDraggingFile) }
                    )}
                >
                    <div className={styles.textBlock}>
                        {i18n._('Drop G-code file here')}
                    </div>
                </div>
                <Dropzone
                    className={styles.dropzone}
                    disabled={this.workspace.controller.workflow.state !== WORKFLOW_STATE_IDLE}
                    disableClick={true}
                    disablePreview={true}
                    multiple={false}
                    onDragStart={(event) => {
                    }}
                    onDragEnter={(event) => {
                        if (this.workspace.controller.workflow.state !== WORKFLOW_STATE_IDLE) {
                            return;
                        }
                        if (isDraggingWidget) {
                            return;
                        }
                        if (!isDraggingFile) {
                            this.setState({ isDraggingFile: true });
                        }
                    }}
                    onDragLeave={(event) => {
                        if (this.workspace.controller.workflow.state !== WORKFLOW_STATE_IDLE) {
                            return;
                        }
                        if (isDraggingWidget) {
                            return;
                        }
                        if (isDraggingFile) {
                            this.setState({ isDraggingFile: false });
                        }
                    }}
                    onDrop={(acceptedFiles, rejectedFiles) => {
                        if (this.workspace.controller.workflow.state !== WORKFLOW_STATE_IDLE) {
                            return;
                        }
                        if (isDraggingWidget) {
                            return;
                        }
                        if (isDraggingFile) {
                            this.setState({ isDraggingFile: false });
                        }
                        this.onDrop(acceptedFiles);
                    }}
                >
                    <div className={styles.workspaceTable}>
                        <div className={styles.workspaceTableRow}>
                            <div
                                ref={node => {
                                    this.primaryContainer = node;
                                }}
                                className={classNames(
                                    styles.primaryContainer,
                                    { [styles.hidden]: hidePrimaryContainer }
                                )}
                                style={{ backgroundColor: this.workspace.bkColor }}
                            >
                                <ButtonToolbar style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between' }}>
                                    <ButtonGroup
                                        style={{ marginLeft: 0, marginRight: 10 }}
                                        btnSize="sm"
                                        btnStyle="flat"
                                    >
                                        <Button
                                            style={{ minWidth: 30 }}
                                            compact
                                            onClick={this.togglePrimaryContainer}
                                        >
                                            <i className="fa fa-chevron-left" />
                                        </Button>
                                    </ButtonGroup>
                                    <ButtonGroup
                                        style={{ marginLeft: 0, marginRight: 0 }}
                                        btnSize="sm"
                                        btnStyle="flat"
                                    >
                                        <Button
                                            style={{ minWidth: 30 }}
                                            compact
                                            title={i18n._('Collapse All')}
                                            onClick={event => {
                                                this.primaryWidgets.collapseAll();
                                            }}
                                        >
                                            <i className="fa fa-chevron-up" style={{ fontSize: 14 }} />
                                        </Button>
                                        <Button
                                            style={{ minWidth: 30 }}
                                            compact
                                            title={i18n._('Expand All')}
                                            onClick={event => {
                                                this.primaryWidgets.expandAll();
                                            }}
                                        >
                                            <i className="fa fa-chevron-down" style={{ fontSize: 14 }} />
                                        </Button>
                                    </ButtonGroup>
                                </ButtonToolbar>
                                <PrimaryWidgets
                                    ref={node => {
                                        this.primaryWidgets = node;
                                    }}
                                    workspaceId={this.workspace.id}
                                    onForkWidget={this.widgetEventHandler.onForkWidget}
                                    onRemoveWidget={this.widgetEventHandler.onRemoveWidget}
                                    onDragStart={this.widgetEventHandler.onDragStart}
                                    onDragEnd={this.widgetEventHandler.onDragEnd}
                                />
                            </div>
                            {hidePrimaryContainer && (
                                <div
                                    ref={node => {
                                        this.primaryToggler = node;
                                    }}
                                    className={styles.primaryToggler}
                                >
                                    <ButtonGroup
                                        btnSize="sm"
                                        btnStyle="flat"
                                    >
                                        <Button
                                            style={{ minWidth: 30 }}
                                            compact
                                            onClick={this.togglePrimaryContainer}
                                        >
                                            <i className="fa fa-chevron-right" />
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )}
                            <div
                                ref={node => {
                                    this.defaultContainer = node;
                                }}
                                className={classNames(
                                    styles.defaultContainer,
                                    styles.fixed
                                )}
                            >
                                <CenterWidgets workspaceId={this.workspace.id} />
                            </div>
                            {hideSecondaryContainer && (
                                <div
                                    ref={node => {
                                        this.secondaryToggler = node;
                                    }}
                                    className={styles.secondaryToggler}
                                >
                                    <ButtonGroup
                                        btnSize="sm"
                                        btnStyle="flat"
                                    >
                                        <Button
                                            style={{ minWidth: 30 }}
                                            compact
                                            onClick={this.toggleSecondaryContainer}
                                        >
                                            <i className="fa fa-chevron-left" />
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            )}
                            <div
                                ref={node => {
                                    this.secondaryContainer = node;
                                }}
                                className={classNames(
                                    styles.secondaryContainer,
                                    { [styles.hidden]: hideSecondaryContainer }
                                )}
                                style={{ backgroundColor: this.workspace.bkColor }}
                            >
                                <ButtonToolbar style={{ margin: '5px 0' }}>
                                    <div className="pull-left">
                                        <ButtonGroup
                                            style={{ marginLeft: 0, marginRight: 10 }}
                                            btnSize="sm"
                                            btnStyle="flat"
                                        >
                                            <Button
                                                style={{ minWidth: 30 }}
                                                compact
                                                title={i18n._('Collapse All')}
                                                onClick={event => {
                                                    this.secondaryWidgets.collapseAll();
                                                }}
                                            >
                                                <i className="fa fa-chevron-up" style={{ fontSize: 14 }} />
                                            </Button>
                                            <Button
                                                style={{ minWidth: 30 }}
                                                compact
                                                title={i18n._('Expand All')}
                                                onClick={event => {
                                                    this.secondaryWidgets.expandAll();
                                                }}
                                            >
                                                <i className="fa fa-chevron-down" style={{ fontSize: 14 }} />
                                            </Button>
                                        </ButtonGroup>
                                        <ButtonGroup
                                            style={{ marginLeft: 0, marginRight: 10 }}
                                            btnSize="sm"
                                            btnStyle="flat"
                                        >
                                            <Button
                                                style={{ width: 230 }}
                                                onClick={this.updateWidgetsForSecondaryContainer}
                                            >
                                                <i className="fa fa-list-alt" />
                                                {i18n._('Manage Widgets ({{inactiveCount}})', {
                                                    inactiveCount: inactiveCount
                                                })}
                                            </Button>
                                        </ButtonGroup>
                                        <ButtonGroup
                                            style={{ marginLeft: 0, marginRight: 0 }}
                                            btnSize="sm"
                                            btnStyle="flat"
                                        >
                                            <Button
                                                style={{ minWidth: 30 }}
                                                compact
                                                onClick={this.toggleSecondaryContainer}
                                            >
                                                <i className="fa fa-chevron-right" />
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </ButtonToolbar>
                                <SecondaryWidgets
                                    ref={node => {
                                        this.secondaryWidgets = node;
                                    }}
                                    workspaceId={this.workspace.id}
                                    onForkWidget={this.widgetEventHandler.onForkWidget}
                                    onRemoveWidget={this.widgetEventHandler.onRemoveWidget}
                                    onDragStart={this.widgetEventHandler.onDragStart}
                                    onDragEnd={this.widgetEventHandler.onDragEnd}
                                />
                            </div>
                        </div>
                    </div>
                </Dropzone>
                {blockingText && (
                    <div className={styles.mask}>
                        <div className={styles.maskOverlay}>
                            {blockingText}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(Workspace);
