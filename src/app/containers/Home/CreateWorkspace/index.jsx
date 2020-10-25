import _ from 'lodash';
import classNames from 'classnames';
import Controller from 'cncjs-controller';
import io from 'socket.io-client';
import React, { PureComponent } from 'react';
import Widget from 'app/components/Widget';
import api from 'app/api';
import i18n from 'app/lib/i18n';
import { submitMachineProfileSuggestion } from 'app/lib/ows/machines';
import log from 'app/lib/log';
import auth from 'app/lib/auth';
import Hardware from 'app/lib/hardware';
import Workspaces from 'app/lib/workspaces';
import analytics from 'app/lib/analytics';
import WorkspaceAxis from 'app/lib/workspace-axis';
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
        setAxisValue: ((axisName, key, value, workspaceSettings) => {
            const axes = this.actions.getAxisMap([], workspaceSettings.axes);
            const axisKey = axisName.toLowerCase();
            const vvv = Number(value);
            log.debug('update', axisKey, 'on', axes[axisKey], 'set', key, 'to', vvv);
            const record = { ...axes[axisKey]._record, [key]: vvv };
            // Rebuild object for state change.
            axes[axisKey] = new WorkspaceAxis(null, axisName, record);
            this.setState({
                workspaceSettings: {
                    ...workspaceSettings,
                    axes: axes,
                },
            });
        }),
        updateWorkspace: (workspaceSettings) => {
            log.debug('workspace', workspaceSettings);
            if (workspaceSettings.bkColor) {
                this.props.setBackgroundColor(workspaceSettings.bkColor);
            }
            this.setState({
                workspaceSettings,
            });
        },
        getAxisMap(axesArray, existingMap = {}) {
            const axes = { ...existingMap };
            axesArray.forEach((axis) => {
                axes[axis.name.toLowerCase()] = new WorkspaceAxis(null, axis.name, axis);
            });
            ['x', 'y', 'z'].forEach((key) => {
                if (!axes[key]) {
                    axes[key] = new WorkspaceAxis(null, key);
                }
            });
            return axes;
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
        handleOpenPort: (firmware) => {
            this.openPort(firmware);
        },
        handleClosePort: (event) => {
            const { port } = this.state;
            this.closePort(port);
        },
        // Convert API data into storage data.
        packFeatures: (featureRecords) => {
            const ret = {};
            featureRecords.forEach(fr => {
                if (fr.disabled) {
                    ret[fr.key] = false;
                } else {
                    ret[fr.key] = fr;
                }
            });
            return ret;
        },
        handleSubmitToCatalog: (submit, payload) => {
            if (!submit) {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            }
            return submitMachineProfileSuggestion(payload);
        },
        handleCreateWorkspace: (workspaceSettings) => {
            const payload = { ...workspaceSettings };
            const { customMachine } = workspaceSettings;
            const axes = {};
            Object.keys(payload.axes).forEach((axisKey) => {
                // Unwrap machine axis objects.
                axes[axisKey] = payload.axes[axisKey]._record;
            });
            payload.axes = axes;
            const submit = customMachine && customMachine.submit;

            log.debug('create workspace', payload, 'submit?', submit);
            this.setState({ creating: true, createWorkspaceError: null });
            this.actions.handleSubmitToCatalog(submit, payload)
                .then(() => {
                    return api.workspaces.create(payload);
                })
                .then((res) => {
                    const record = res.body;
                    Workspaces.load(record);
                    window.location = '/#' + Workspaces.all[record.id].path;
                    window.location.reload();
                })
                .catch((res) => {
                    const err = res.body && res.body.msg ? res.body.msg :
                        i18n._('An unexpected error has occurred.');
                    this.setState({
                        createWorkspaceError: err,
                        creating: false
                    });
                });
        }
    };

    setPortList(ports, settings = {}) {
        const usedPorts = Object.keys(Workspaces.all).map((k) => {
            return Workspaces.all[k].firmware.port;
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
                hasValidFirmware: false,
                serialOutput: [],
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
                hasValidFirmware: false,
                serialOutput: [],
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
                hasValidFirmware: false,
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
            const compatibility = this.hardware.getFirmwareCompatibility(reqFw);
            const hasFwError = compatibility && _.has(compatibility, 'error');
            const hasValidFirmware = !!(this.hardware.isValid && !hasFwError);
            log.debug('Firmware', reqFw, 'valid?', hasValidFirmware, 'error', compatibility);
            this.setState({
                controllerSettings: controllerSettings,
                hardware: this.hardware,
                controllerType: type,
                firmwareCompatibility: compatibility,
                hasValidFirmware: hasValidFirmware,
            });
        },
        'serialport:read': (data) => {
            log.debug('serialport read', data);
            const serialOutput = this.state.serialOutput;
            serialOutput.push(data);
            this.setState({ serialOutput: serialOutput });
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
            serialOutput: [],
            firmwareCompatibility: null,
            hasValidFirmware: false,
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
                    connected: false,
                    hasValidFirmware: false,
                }));

                log.error(err);
                return;
            }
        });
    }

    closePort(port = this.state.port) {
        this.setState(state => ({
            connecting: false,
            connected: false,
            hasValidFirmware: false,
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
            firmwareCompatibility: state.firmwareCompatibility,
            hasValidFirmware: state.hasValidFirmware,
            serialOutput: state.serialOutput,
        };

        const bkColor = state.workspaceSettings.bkColor || Workspaces.defaultBkColor;

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
                        creating={state.creating}
                        createError={state.createWorkspaceError}
                        bkColor={bkColor}
                    />
                </Widget.Content>
            </Widget>
        );
    }
}

export default CreateWorkspaceWidget;
