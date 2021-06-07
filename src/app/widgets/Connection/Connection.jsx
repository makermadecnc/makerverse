import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Workspaces from 'app/lib/workspaces';
import log from 'app/lib/log';
import analytics from 'app/lib/analytics';
import Controller from 'cncjs-controller';
import io from 'socket.io-client';
import auth from 'app/lib/auth';
import find from 'lodash/find';
import map from 'lodash/map';
import { ToastNotification } from 'app/components/Notifications';
import i18n from 'app/lib/i18n';
import Select from 'react-select';
import styles from './index.styl';

class Connection extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    state = { port: null };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    controller = new Controller(io);

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

    selectPort(selectedPort) {
        console.log(selectedPort, 'port value passed to selectPort');
        this.setState({ port: selectedPort });
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
        }
    }

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

    renderPortValue = (option) => {
        const { label, inuse } = option;
        const canChangePort = !this.state.loadingPorts;
        const style = {
            color: canChangePort ? '#333' : '#ccc',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        return (
            <div style={style} title={label}>
                {inuse && (
                    <span>
                        <i className="fa fa-lock" />
                        <Space width="8" />
                    </span>
                )}
                {label}
            </div>
        );
    };

    renderPortOption = (option) => {
        const { label, inuse, manufacturer } = option;
        const styles = {
            option: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
            }
        };

        return (
            <div style={styles.option} title={label}>
                <div>
                    {inuse && (
                        <span>
                            <i className="fa fa-lock" />
                            <Space width="8" />
                        </span>
                    )}
                    {label}
                </div>
                {manufacturer &&
                    <i>{i18n._('Manufacturer: {{manufacturer}}', { manufacturer })}</i>
                }
            </div>
        );
    }

    isPortInUse = (port) => {
        port = this.state.port;
        const o = find(this.state.ports, { port }) || {};
        return !!(o.inuse);
    };


    render() {
        const { state, actions } = this.props;
        const { connecting, connected, alertMessage } = state;
        const controllerConfig = this.workspace._record.firmware;
        const port = this.state?.port;
        const baudrate = controllerConfig.baudRate;
        const canOpenPort = port && baudrate && !connecting && !connected;

        return (
            <div>
                {alertMessage && (
                    <ToastNotification
                        style={{ margin: '-10px -10px 10px -10px' }}
                        type="error"
                        onDismiss={actions.clearAlert}
                    >
                        {alertMessage}
                    </ToastNotification>
                )}
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Controller')}>
                            {i18n._('Controller')}
                        </div>
                    </div>
                    <div className="col col-xs-8">
                        <div className={styles.well} title={controllerConfig.controllerType}>
                            {controllerConfig.controllerType}
                        </div>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Port')}>
                            {i18n._('Port')}
                        </div>
                    </div>
                    <div className="col col-xs-7">
                        <Select
                            options={map(this.state?.ports, (o) => ({
                                value: o.port,
                                label: o.port,
                                manufacturer: o.manufacturer,
                                inuse: o.inuse
                            }))}
                            name="port"
                            noResultsText={i18n._('No ports available')}
                            onChange={(o) => this.selectPort(o.value)}
                            optionRenderer={this.renderPortOption}
                            valueRenderer={this.renderPortValue}
                            value={port}
                            searchable={false}
                            clearable={false}
                            className="sm"
                        />
                    </div>
                    <div className="col col-xs-1">
                        <button
                            onClick={() => {
                                this.refreshPorts();
                            }}
                            style={{ padding: 0, height: 30, marginLeft: 3 }}
                        ><i className="fa fa-undo fa-fw" />
                        </button>
                    </div>
                </div>
                <div className="row no-gutters">
                    <div className="col col-xs-4">
                        <div className={styles.textEllipsis} title={i18n._('Baud Rate')}>
                            {i18n._('Baud Rate')}
                        </div>
                    </div>
                    <div className="col col-xs-8">
                        <div className={styles.well} title={baudrate}>
                            {baudrate}
                        </div>
                    </div>
                </div>
                <div className="btn-group btn-group-sm">
                    {!connected && (
                        <button
                            type="button"
                            className="btn btn-primary"
                            disabled={!canOpenPort}
                            onClick={(e) => {
                                actions.handleOpenPort(e, this.state.port);
                            }}
                            title="Open connection to control board"
                        >
                            <i className="fa fa-toggle-off" />
                            <Space width="8" />
                            {i18n._('Open')}
                        </button>
                    )}
                    {connected && (
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={(e) => {
                                actions.handleClosePort(e, this.state.port);
                            }}
                            title="Close connection to control board"
                        >
                            <i className="fa fa-toggle-on" />
                            <Space width="8" />
                            {i18n._('Close')}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default Connection;
