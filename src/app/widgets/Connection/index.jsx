import classNames from 'classnames';
import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
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
            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: true
            }));
        },
        'serialport:close': (options) => {
            this.setState(state => ({
                alertMessage: '',
                connecting: false,
                connected: false
            }));
        },
        'serialport:error': (options) => {
            const { port } = options;

            this.setState(state => ({
                alertMessage: i18n._('Error opening serial port \'{{- port}}\'', { port: port }),
                connecting: false,
                connected: false
            }));
        }
    };

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
    }

    componentWillUnmount() {
        this.workspace.removeControllerEvents(this.controllerEvents);
    }

    componentDidUpdate(prevProps, prevState) {
        const {
            minimized,
        } = this.state;

        this.config.set('minimized', minimized);
    }

    getInitialState() {
        if (!includes(this.workspace.controller.loadedControllers, this.workspace.controllerAttributes.type)) {
            log.error('controller type not loaded', this.workspace.controllerAttributes.type);
        }

        return {
            minimized: this.config.get('minimized', false),
            isFullscreen: false,
            loading: false,
            connecting: this.workspace.isConnecting,
            connected: this.workspace.isConnected,
            alertMessage: ''
        };
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
        this.workspace.openPort((err) => {
            if (err) {
                const v = { port: this.workspace.controllerAttributes.port };
                this.setState(state => ({
                    alertMessage: i18n._('Error opening serial port \'{{- port}}\'', v),
                    connecting: false,
                    connected: false
                }));
            }
        });
    }

    closePort() {
        this.setState(state => ({
            connecting: false,
            connected: false
        }));
        this.workspace.closePort();
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
