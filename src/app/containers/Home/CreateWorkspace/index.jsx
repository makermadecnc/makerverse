import classNames from 'classnames';
import Controller from 'cncjs-controller';
import io from 'socket.io-client';
import React, { PureComponent } from 'react';
import Widget from 'app/components/Widget';
import api from 'app/api';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import auth from 'app/lib/auth';
import Hardware from 'app/lib/hardware';
import Workspaces from 'app/lib/workspaces';
import analytics from 'app/lib/analytics';
import CreateWorkspacePanel from './CreateWorkspacePanel';
import styles from './index.styl';

class CreateWorkspaceWidget extends PureComponent {
    // Public methods
    collapse = () => {
        this.setState({ minimized: true });
    };

    expand = () => {
        this.setState({ minimized: false });
    };

    controller = new Controller(io);

    state = this.getInitialState();

    hardware = null;

    actions = {
        updateWorkspace: (workspaceSettings) => {
            log.debug('workspace', workspaceSettings);
            this.setState({
                workspaceSettings,
            });
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
        toggleAutoReconnect: (event) => {
            const checked = event.target.checked;
            this.setState(state => ({
                autoReconnect: checked
            }));
        },
        handleRefreshPorts: (event) => {
            this.refreshPorts();
        },
        handleOpenPort: (controllerType, port, baudRate, rtscts = false) => {
            this.openPort({ controllerType, port, baudRate, rtscts });
        },
        handleClosePort: (event) => {
            const { port } = this.state;
            this.closePort(port);
        },
        handleCreateWorkspace: (event) => {
            this.setState({ creating: true });
            const { name, port, baudRate, controllerType, connection, autoReconnect } = this.state;
            api.workspaces.create({
                name: name,
                controller: {
                    controllerType,
                    port,
                    baudRate: baudRate,
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

    setPortList(ports, settings = {}) {
        const usedPorts = Object.keys(Workspaces.all).map((k) => {
            return Workspaces.all[k].controllerAttributes.port;
        });
        ports.forEach((p) => {
            p.inUse = usedPorts.includes(p.port);
        });
        this.setState({
            ...settings,
            ports: ports
        });
    }

    handlePortUpdate(port, inuse, settings = {}) {
        const ports = this.state.ports.map((o) => {
            if (o.port !== port) {
                return o;
            }
            return { ...o, inuse };
        });
        this.setPortList(ports, settings);
    }

    controllerEvents = {
        'serialport:list': (ports) => {
            log.debug('Received a list of serial ports:', ports);

            this.stopLoading();
            this.setPortList(ports);
        },
        'serialport:change': (options) => {
            this.handlePortUpdate(options.port, options.inuse);
        },
        'serialport:open': (options) => {
            const { controllerType, port } = options;
            this.handlePortUpdate(port, options.inuse, {
                alertMessage: '',
                connecting: false,
                connected: true,
                controllerType: controllerType,
            });
            log.debug(`Established a connection to ${controllerType} on the serial port "${port}"`);
            analytics.event({
                category: 'controller',
                action: 'open',
                label: controllerType,
            });
        },
        'serialport:close': (options) => {
            log.debug(`The serial port "${options.port}" is disconected`);
            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: false,
                controllerType: null,
            }));

            this.refreshPorts();
        },
        'serialport:error': (options) => {
            const { port } = options;

            this.setState(state => ({
                alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: port }),
                connecting: false,
                connected: false,
                controllerType: null,
            }));

            log.error(`Error opening serial port "${port}"`);
            analytics.exception({
                description: 'error opening serial port',
                fatal: false,
            });
        },
        'controller:settings': (type, controllerSettings) => {
            log.debug('Got', type, 'settings:', controllerSettings);
            this.hardware.updateControllerSettings(controllerSettings);
            const reqFw = this.state.workspaceSettings.firmware;
            const fwError = this.hardware.getFirmwareCompatibilityError(reqFw);
            console.log('firmware', fwError, reqFw);
            this.setState({
                controllerSettings: controllerSettings,
                hardware: this.hardware,
                controllerType: type,
                firmwareError: fwError,
            });
        },
        'serialport:read': (data) => {
            log.debug('serialport read', data);
        },
    };

    componentDidMount() {
        this._mounting = true;
        this.controller.connect(auth.host, auth.socket, () => {
            this.addControllerEvents();
            this.refreshPorts();
            this._mounting = false;
        });
    }

    componentWillUnmount() {
        this.removeControllerEvents();
    }

    getInitialState() {
        return {
            workspaceSettings: {},
            name: null,
            minimized: false,
            loadingPorts: false,
            connecting: false,
            connected: false,
            creating: false,
            hasValidConnection: false,
            controllerSettings: null,
            ports: [],
            alertMessage: '',
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
            loadingPorts: true
        }));
        this._loadingTimer = setTimeout(() => {
            this.setState(state => ({
                loadingPorts: false
            }));
        }, delay);
    }

    stopLoading() {
        if (this._loadingTimer) {
            clearTimeout(this._loadingTimer);
            this._loadingTimer = null;
        }
        this.setState(state => ({
            loadingPorts: false
        }));
    }

    refreshPorts() {
        this.startLoading();
        this.controller.listPorts();
    }

    openPort(options) {
        const { controllerType, port, baudRate, rtscts } = { ...options };

        this.setState(state => ({
            connecting: true,
            controllerSettings: null,
            port: port,
            controllerType: controllerType,
        }));

        this.hardware = new Hardware(null, controllerType);

        this.controller.openPort(port, {
            controllerType: controllerType,
            baudrate: baudRate,
            rtscts: !!rtscts,
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
        const state = { ...this.state };
        const actions = { ...this.actions };

        if (this._mounting) {
            return <div>Connecting...</div>;
        }

        // Downstream object for Connection nodes.
        const connectionStatus = {
            controller: this.controller,
            controllerType: state.controllerType,
            settings: state.controllerSettings,
            hardware: this.hardware,
            loadingPorts: state.loadingPorts,
            ports: state.ports,
            connecting: state.connecting,
            connected: state.connected,
            firmwareError: state.firmwareError,
        };

        return (
            <Widget className={styles.widgetWide}>
                <Widget.Header>
                    <Widget.Title>
                        {i18n._('New Workspace')}
                    </Widget.Title>
                    <Widget.Controls>
                        <Widget.Button
                            title={state.minimized ? i18n._('Expand') : i18n._('Collapse')}
                            onClick={actions.toggleMinimized}
                        >
                            <i
                                className={classNames(
                                    'fa',
                                    'fa-fw',
                                    { 'fa-chevron-up': !state.minimized },
                                    { 'fa-chevron-down': state.minimized }
                                )}
                            />
                        </Widget.Button>
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    className={classNames(
                        styles['widget-content'],
                        { [styles.hidden]: state.minimized }
                    )}
                >
                    <CreateWorkspacePanel
                        connectionStatus={connectionStatus}
                        workspaceSettings={state.workspaceSettings}
                        actions={actions}
                        alertMessage={state.alertMessage}
                    />
                </Widget.Content>
            </Widget>
        );
    }
}

export default CreateWorkspaceWidget;
