import _ from 'lodash';
import classNames from 'classnames';
import Controller from 'cncjs-controller';
import io from 'socket.io-client';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
import { ToastNotification } from 'app/components/Notifications';
import api from 'app/api';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import auth from 'app/lib/auth';
import Workspaces from 'app/lib/workspaces';
import analytics from 'app/lib/analytics';
import {
    MASLOW,
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
        },
        handleCreateWorkspace: (event) => {
            this.setState({ creating: true });
            const { name, port, baudrate, controllerType, connection, autoReconnect } = this.state;
            api.workspaces.create({
                name: name,
                controller: {
                    controllerType,
                    port,
                    baudRate: baudrate,
                    rtscts: connection.serial.rtscts,
                    reconnect: autoReconnect,
                }
            })
                .then((res) => {
                    const record = res.body;
                    Workspaces.load(record);
                    window.location = '/#' + Workspaces.all[record.id].path;
                    window.location.reload();
                })
                .catch((res) => {
                    this.setState({
                        alertMessage: res.body.msg || i18n._('An unexpected error has occurred.'),
                        creating: false
                    });
                });
        }
    };

    setPortList(ports) {
        const usedPorts = Object.keys(Workspaces.all).map((k) => {
            return Workspaces.all[k].controllerAttributes.port;
        });
        const portList = [];
        ports.forEach((p) => {
            if (!usedPorts.includes(p.port)) {
                portList.push(p);
            }
        });
        this.setState({
            ports: portList
        });
    }

    controllerEvents = {
        'serialport:list': (ports) => {
            log.debug('Received a list of serial ports:', ports);

            this.stopLoading();
            this.setPortList(ports);
        },
        'serialport:change': (options) => {
            const { port, inuse } = options;
            const ports = this.state.ports.map((o) => {
                if (o.port !== port) {
                    return o;
                }
                return { ...o, inuse };
            });

            this.setPortList(ports);
        },
        'serialport:open': (options) => {
            const { controllerType, port, baudrate, inuse } = options;
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
                version: null,
                controllerType: controllerType,
                port: port,
                baudrate: baudrate,
                ports: ports
            }));
            log.debug(`Established a connection to ${controllerType} on the serial port "${port}"`);
            analytics.event({
                category: 'controller',
                action: 'open',
                label: controllerType,
            });
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
            analytics.exception({
                description: 'error opening serial port',
                fatal: false,
            });
        },
        'controller:settings': (type, controllerSettings) => {
            let v = null;
            log.debug('Got controller settings', controllerSettings);
            if (type === MASLOW) {
                if (controllerSettings.firmware && controllerSettings.firmware.name.length > 0) {
                    v = `${controllerSettings.firmware.name} v${controllerSettings.firmware.version}`;
                }
            } else if (_.has(controllerSettings, 'version')) {
                if (controllerSettings.version && controllerSettings.version.length > 0) {
                    v = `${type} v${controllerSettings.version}`;
                }
            } else {
                v = `${type} device`;
            }
            if (v) {
                this.setState({ version: v, hasSettings: true });
                analytics.event({
                    category: 'controller',
                    action: 'identified',
                    label: this.state.version,
                });
            } else {
                this.setState({ hasSettings: true });
                analytics.event({
                    category: 'controller',
                    action: 'unidentified',
                    label: type,
                });
            }
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
            name: null,
            minimized: false,
            isFullscreen: false,
            loading: false,
            connecting: false,
            connected: false,
            creating: false,
            hasSettings: false,
            version: null,
            ports: [],
            baudrates: _.reverse(_.sortBy(_.uniq(this.controller.baudrates.concat(defaultBaudrates)))),
            controllerType: MASLOW,
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
            connecting: true,
            hasSettings: false,
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
        const { minimized, isFullscreen, connected, version, name, alertMessage, hasSettings } = this.state;
        const state = {
            ...this.state
        };
        const actions = {
            ...this.actions
        };
        let wrn = 'Querying hardware... the only reason this message would not go away is if you chose the wrong Baud Rate, or the device does not have compatible firmware installed.';
        if (hasSettings) {
            if (!version) {
                wrn = (
                    <span>
                        This device is not running compatible Maslow firmware.
                        <br />
                        Download the <a href="https://github.com/WebControlCNC/Firmware/tree/release/holey" target="_blank" rel="noopener noreferrer">Arduino Mega (Holey) firmware</a>.
                        <br />
                        Download the <a href="https://github.com/makermadecnc/MaslowDue" target="_blank" rel="noopener noreferrer">Arduino Due (M2) firmware</a>.
                    </span>
                );
            } else {
                wrn = '';
            }
        }

        if (this._mounting) {
            return <div>Connecting...</div>;
        }

        return (
            <Widget fullscreen={isFullscreen} className={styles.widgetSmall}>
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
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    className={classNames(
                        styles['widget-content'],
                        { [styles.hidden]: minimized }
                    )}
                >
                    {alertMessage && (
                        <ToastNotification
                            style={{ margin: '-10px -10px 10px -10px' }}
                            type="error"
                            onDismiss={actions.clearAlert}
                        >
                            {alertMessage}
                        </ToastNotification>
                    )}
                    {!connected && (
                        <Connection controller={this.controller} state={state} actions={actions} />
                    )}
                    {connected && (
                        <div>
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    style={{ width: '100%' }}
                                    placeholder="Workspace Name"
                                    value={name || ''}
                                    onChange={e => {
                                        this.setState({ name: e.target.value });
                                    }}
                                />
                                {wrn}
                            </div>
                            <hr />
                            <div>
                                <div
                                    style={{ float: 'right' }}
                                >
                                    <span style={{ paddingRight: '10px', position: 'relative', top: '5px' }}>
                                        {version || ''}
                                    </span>
                                    <button
                                        type="button"
                                        style={{ float: 'right' }}
                                        className="btn btn-primary"
                                        disabled={!version || !name}
                                        onClick={actions.handleCreateWorkspace}
                                        title="Create the workspace"
                                    >
                                        {i18n._('Create Workspace')}
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={actions.handleClosePort}
                                    title="Close connection with control board"
                                >
                                    <i className="fa fa-toggle-on" />
                                    <Space width="8" />
                                    {i18n._('Cancel')}
                                </button>
                            </div>
                        </div>
                    )}
                </Widget.Content>
            </Widget>
        );
    }
}

export default CreateWorkspace;
