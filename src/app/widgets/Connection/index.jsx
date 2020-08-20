import classNames from 'classnames';
import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
import controller from 'app/lib/controller';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import Workspaces from 'app/lib/workspaces';
import WidgetConfig from '../WidgetConfig';
import Connection from './Connection';
import styles from './index.styl';

class ConnectionWidget extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        widgetId: PropTypes.string.isRequired,
        onFork: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        sortable: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    // Public methods
    collapse = () => {
        this.setState({ minimized: true });
    };

    expand = () => {
        this.setState({ minimized: false });
    };

    config = new WidgetConfig(this.props.widgetId);

    state = this.getInitialState();

    actions = {
        toggleFullscreen: () => {
            const { minimized, isFullscreen } = this.state;
            this.setState(state => ({
                minimized: isFullscreen ? minimized : false,
                isFullscreen: !isFullscreen
            }));
        },
        toggleMinimized: () => {
            const { minimized } = this.state;
            this.setState(state => ({
                minimized: !minimized
            }));
        },
        clearAlert: () => {
            this.setState(state => ({
                alertMessage: ''
            }));
        },
        handleOpenPort: (event) => {
            this.openPort();
        },
        handleClosePort: (event) => {
            const { port } = this.state;
            this.closePort(port);
        }
    };

    controllerEvents = {
        // 'serialport:list': (ports) => {
        //     if (this.state.connected) {
        //         return;
        //     }
        // },
        'serialport:change': (options) => {
            this.setState({ ...this.state, ...options });
        },
        'serialport:open': (options) => {
            const { controllerType, port, baudrate } = options;
            const controllerConfig = this.workspace._record.controller;
            if (port !== controllerConfig.port) {
                return;
            }

            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: true,
                controllerType: controllerType,
                port: port,
                baudrate: baudrate
            }));

            log.debug(`Established a connection to the serial port "${port}"`);
        },
        'serialport:close': (options) => {
            const { port } = options;
            const controllerConfig = this.workspace._record.controller;
            if (port !== controllerConfig.port) {
                return;
            }

            log.debug(`The serial port "${port}" is disconected`);

            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: false
            }));
        },
        'serialport:error': (options) => {
            const { port } = options;
            const controllerConfig = this.workspace._record.controller;
            if (port !== controllerConfig.port) {
                return;
            }

            this.setState(state => ({
                alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: port }),
                connecting: false,
                connected: false
            }));

            log.error(`Error opening serial port "${port}"`);
        }
    };

    componentDidMount() {
        this.addControllerEvents();
    }

    componentWillUnmount() {
        this.removeControllerEvents();
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            minimized,
        } = this.state;

        this.config.set('minimized', minimized);
    }

    getInitialState() {
        if (!includes(controller.loadedControllers, this.workspace.controllerType)) {
            console.log('controller type not loaded', this.workspace.controllerType);
        }

        return {
            minimized: this.config.get('minimized', false),
            isFullscreen: false,
            loading: false,
            connecting: false,
            connected: false,
            alertMessage: ''
        };
    }

    addControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.addListener(eventName, callback);
        });
    }

    removeControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            controller.removeListener(eventName, callback);
        });
    }

    startLoading() {
        const delay = 5 * 1000; // wait for 5 seconds

        this.setState(state => ({
            loading: true
        }));
        this._loadingTimer = setTimeout(() => {
            this.setState(state => ({
                loading: false
            }));
        }, delay);
    }

    stopLoading() {
        if (this._loadingTimer) {
            clearTimeout(this._loadingTimer);
            this._loadingTimer = null;
        }
        this.setState(state => ({
            loading: false
        }));
    }

    openPort() {
        this.setState(state => ({
            connecting: true
        }));
        const controllerConfig = this.workspace._record.controller;

        controller.openPort(controllerConfig.port, {
            controllerType: this.workspace.controllerType,
            baudrate: controllerConfig.baudRate,
            rtscts: controllerConfig.rtscts
        }, (err) => {
            if (err) {
                this.setState(state => ({
                    alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: controllerConfig.port }),
                    connecting: false,
                    connected: false
                }));

                log.error(err);
                return;
            }
        });
    }

    closePort() {
        this.setState(state => ({
            connecting: false,
            connected: false
        }));
        const controllerConfig = this.workspace._record.controller;
        controller.closePort(controllerConfig.port, (err) => {
            if (err) {
                log.error(err);
                return;
            }
        });
    }

    render() {
        const { widgetId } = this.props;
        const { minimized, isFullscreen } = this.state;
        const isForkedWidget = widgetId.match(/\w+:[\w\-]+/);
        const state = {
            ...this.state
        };
        const actions = {
            ...this.actions
        };

        return (
            <Widget fullscreen={isFullscreen}>
                <Widget.Header>
                    <Widget.Title>
                        <Widget.Sortable className={this.props.sortable.handleClassName}>
                            <i className="fa fa-bars" />
                            <Space width="8" />
                        </Widget.Sortable>
                        {isForkedWidget &&
                        <i className="fa fa-code-fork" style={{ marginRight: 5 }} />
                        }
                        {i18n._('Connection')}
                    </Widget.Title>
                    <Widget.Controls className={this.props.sortable.filterClassName}>
                        <Widget.Button
                            disabled={isFullscreen}
                            title={minimized ? i18n._('Expand') : i18n._('Collapse')}
                            onClick={actions.toggleMinimized}
                        >
                            <i
                                className={classNames(
                                    'fa',
                                    'fa-fw',
                                    { 'fa-chevron-up': !minimized },
                                    { 'fa-chevron-down': minimized }
                                )}
                            />
                        </Widget.Button>
                        <Widget.DropdownButton
                            title={i18n._('More')}
                            toggle={<i className="fa fa-ellipsis-v" />}
                            onSelect={(eventKey) => {
                                if (eventKey === 'fullscreen') {
                                    actions.toggleFullscreen();
                                }
                            }}
                        >
                            <Widget.DropdownMenuItem eventKey="fullscreen">
                                <i
                                    className={classNames(
                                        'fa',
                                        'fa-fw',
                                        { 'fa-expand': !isFullscreen },
                                        { 'fa-compress': isFullscreen }
                                    )}
                                />
                                <Space width="4" />
                                {!isFullscreen ? i18n._('Enter Full Screen') : i18n._('Exit Full Screen')}
                            </Widget.DropdownMenuItem>
                        </Widget.DropdownButton>
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    className={classNames(
                        styles['widget-content'],
                        { [styles.hidden]: minimized }
                    )}
                >
                    <Connection state={state} actions={actions} workspaceId={this.workspace.id} />
                </Widget.Content>
            </Widget>
        );
    }
}

export default ConnectionWidget;
