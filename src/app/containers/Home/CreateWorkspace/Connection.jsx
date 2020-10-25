import find from 'lodash/find';
import map from 'lodash/map';
import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Select from 'react-select';
import Space from 'app/components/Space';
import i18n from 'app/lib/i18n';

export const ConnectionStatusType = PropTypes.shape({
    ports: PropTypes.arrayOf(PropTypes.object), // List of serial ports
    loadingPorts: PropTypes.bool.isRequired, // Are we querying for USB serial ports?
    controller: PropTypes.object.isRequired, // the Controller instance with which to connect.
    connecting: PropTypes.bool.isRequired, // Are we trying to establish serial connection?
    connected: PropTypes.bool.isRequired, // Are we connected?
    // -- if connected --
    controllerType: PropTypes.string, // The internal controller implementation name
    hardware: PropTypes.object, // the MachineHardware instance
    settings: PropTypes.object, // controller settings, as they came from the websocket
    firmwareCompatibility: PropTypes.object, // firmware mismatch or detection error from hardware
    hasValidFirmware: PropTypes.bool, // All is good, we can create a workspace?
    serialOutput: PropTypes.arrayOf(PropTypes.string).isRequired, // Direct from the console.
}).isRequired;

class Connection extends PureComponent {
    static propTypes = { connectionStatus: ConnectionStatusType };

    state = { port: null };

    isPortInUse = (port) => {
        const { state } = this.props;
        port = port || state.port;
        const o = find(state.ports, { port }) || {};
        return !!(o.inuse);
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

    renderPortValue = (option) => {
        const { label, inuse } = option;
        const canChangePort = !this.props.loading;
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

    render() {
        const {
            connectionStatus,
            disabled,
            isLoading,
            handleRefreshPorts,
        } = this.props;
        const { port } = this.state;
        const canConnect = !disabled && port && !connectionStatus.connected;

        return (
            <div>
                <div className={cx('form-group')}>
                    <div className="input-group input-group-sm">
                        <Select
                            backspaceRemoves={false}
                            className="sm"
                            clearable={false}
                            disabled={disabled}
                            name="port"
                            noResultsText={i18n._('No ports available')}
                            onChange={(o) => this.setState({ port: o.value })}
                            optionRenderer={this.renderPortOption}
                            options={map(connectionStatus.ports, (o) => ({
                                value: o.port,
                                label: o.port,
                                manufacturer: o.manufacturer,
                                inuse: o.inuse
                            }))}
                            placeholder={i18n._('Choose a port')}
                            searchable={false}
                            value={port}
                            valueRenderer={this.renderPortValue}
                        />
                        <div className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-default"
                                name="btn-refresh"
                                title={i18n._('Refresh')}
                                onClick={handleRefreshPorts}
                                disabled={disabled}
                            >
                                <i
                                    className={cx(
                                        'fa',
                                        'fa-refresh',
                                        { 'fa-spin': isLoading }
                                    )}
                                />
                            </button>
                        </div>
                        <div className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-primary"
                                disabled={!canConnect}
                                onClick={() => this.props.handleOpenPort(port)}
                                title="Open connection to control board"
                            >
                                <i className="fa fa-toggle-off" />
                                <Space width="8" />
                                {i18n._('Connect')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Connection;
