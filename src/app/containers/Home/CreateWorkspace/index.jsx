import classNames from 'classnames';
import reverse from 'lodash/reverse';
import sortBy from 'lodash/sortBy';
import uniq from 'lodash/uniq';
import Controller from 'cncjs-controller';
import io from 'socket.io-client';
import includes from 'lodash/includes';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import auth from 'app/lib/auth';
import {
    MASLOW
} from 'app/constants';
import Connection from './Connection';
import styles from './index.styl';

class CreateWorkspace extends PureComponent {
    // Public methods
    collapse = () => {
        this.setState({ minimized: true });
    };

    expand = () => {
        this.setState({ minimized: false });
    };

    controller = new Controller(io);

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
        changeController: (controllerType) => {
            this.setState(state => ({
                controllerType: controllerType
            }));
        },
        onChangePortOption: (option) => {
            this.setState(state => ({
                alertMessage: '',
                port: option.value
            }));
        },
        onChangeBaudrateOption: (option) => {
            this.setState(state => ({
                alertMessage: '',
                baudrate: option.value
            }));
        },
        toggleAutoReconnect: (event) => {
            const checked = event.target.checked;
            this.setState(state => ({
                autoReconnect: checked
            }));
        },
        toggleHardwareFlowControl: (event) => {
            const checked = event.target.checked;
            this.setState(state => ({
                connection: {
                    ...state.connection,
                    serial: {
                        ...state.connection.serial,
                        rtscts: checked
                    }
                }
            }));
        },
        handleRefreshPorts: (event) => {
            this.refreshPorts();
        },
        handleOpenPort: (event) => {
            const { port, baudrate } = this.state;
            this.openPort(port, { baudrate: baudrate });
        },
        handleClosePort: (event) => {
            const { port } = this.state;
            this.closePort(port);
        }
    };

    controllerEvents = {
        'serialport:list': (ports) => {
            log.debug('Received a list of serial ports:', ports);

            this.stopLoading();
            this.setState(state => ({
                ports: ports
            }));
        },
        'serialport:change': (options) => {
            const { port, inuse } = options;
            const ports = this.state.ports.map((o) => {
                if (o.port !== port) {
                    return o;
                }
                return { ...o, inuse };
            });

            this.setState(state => ({
                ports: ports
            }));
        },
        'serialport:open': (options) => {
            /*const { controllerType, port, baudrate, inuse } = options;
            const ports = this.state.ports.map((o) => {
                if (o.port !== port) {
                    return o;
                }
                return { ...o, inuse };
            });

            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: true,
                controllerType: controllerType, // Grbl|Marlin
                port: port,
                baudrate: baudrate,
                ports: ports
            }));*/
            const { port } = options;
            log.debug(`Established a connection to the serial port "${port}"`);
        },
        'serialport:close': (options) => {
            const { port } = options;

            log.debug(`The serial port "${port}" is disconected`);

            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: false
            }));

            this.refreshPorts();
        },
        'serialport:error': (options) => {
            const { port } = options;

            this.setState(state => ({
                alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: port }),
                connecting: false,
                connected: false
            }));

            log.error(`Error opening serial port "${port}"`);
        }
    };

    componentDidMount() {
        this._mounting = true;
        this.controller.connect(auth.host, auth.options, () => {
            this.addControllerEvents();
            this.refreshPorts();
            this._mounting = false;
        });
    }

    componentWillUnmount() {
        this.removeControllerEvents();
    }

    getInitialState() {
        let controllerType = MASLOW;
        if (!includes(this.controller.loadedControllers, controllerType)) {
            controllerType = this.controller.loadedControllers[0];
        }

        // Common baud rates
        const defaultBaudrates = [
            250000,
            115200,
            57600,
            38400,
            19200,
            9600,
            2400
        ];

        return {
            minimized: false,
            isFullscreen: false,
            loading: false,
            connecting: false,
            connected: false,
            ports: [],
            baudrates: reverse(sortBy(uniq(this.controller.baudrates.concat(defaultBaudrates)))),
            controllerType: controllerType,
            port: this.controller.port,
            baudrate: 0,
            connection: {
                serial: {
                    rtscts: false
                }
            },
            autoReconnect: false,
            hasReconnected: false,
            alertMessage: ''
        };
    }

    addControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            this.controller.addListener(eventName, callback);
        });
    }

    removeControllerEvents() {
        Object.keys(this.controllerEvents).forEach(eventName => {
            const callback = this.controllerEvents[eventName];
            this.controller.removeListener(eventName, callback);
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

    refreshPorts() {
        this.startLoading();
        this.controller.listPorts();
    }

    openPort(port, options) {
        const { baudrate } = { ...options };

        this.setState(state => ({
            connecting: true
        }));

        this.controller.openPort(port, {
            controllerType: this.state.controllerType,
            baudrate: baudrate,
            rtscts: this.state.connection.serial.rtscts
        }, (err) => {
            if (err) {
                this.setState(state => ({
                    alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: port }),
                    connecting: false,
                    connected: false
                }));

                log.error(err);
                return;
            }
        });
    }

    closePort(port = this.state.port) {
        this.setState(state => ({
            connecting: false,
            connected: false
        }));
        this.controller.closePort(port, (err) => {
            if (err) {
                log.error(err);
                return;
            }

            // Refresh ports
            this.controller.listPorts();
        });
    }

    render() {
        const { minimized, isFullscreen } = this.state;
        const state = {
            ...this.state
        };
        const actions = {
            ...this.actions
        };

        if (this._mounting) {
            return <div>Connecting...</div>;
        }

        return (
            <Widget fullscreen={isFullscreen}>
                <Widget.Header>
                    <Widget.Title>
                        {i18n._('New Workspace')}
                    </Widget.Title>
                    <Widget.Controls>
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
                    <Connection controller={this.controller} state={state} actions={actions} />
                </Widget.Content>
            </Widget>
        );
    }
}

export default CreateWorkspace;
