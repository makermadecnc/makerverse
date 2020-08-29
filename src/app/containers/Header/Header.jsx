import classNames from 'classnames';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { Nav, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import without from 'lodash/without';
import Push from 'push.js';
import api from 'app/api';
import { Tooltip } from 'app/components/Tooltip';
import Anchor from 'app/components/Anchor';
import Space from 'app/components/Space';
import combokeys from 'app/lib/combokeys';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import * as user from 'app/lib/user';
import store from 'app/store';
import Workspaces from 'app/lib/workspaces';
import settings from 'app/config/settings';
import QuickAccessToolbar from './QuickAccessToolbar';
import styles from './index.styl';

class Header extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes
    };

    get workspace() {
        return Workspaces.findByPath(this.props.location.pathname);
    }

    state = this.getInitialState();

    actions = {
        requestPushPermission: () => {
            const onGranted = () => {
                this.setState({ pushPermission: Push.Permission.GRANTED });
            };
            const onDenied = () => {
                this.setState({ pushPermission: Push.Permission.DENIED });
            };
            // Note that if "Permission.DEFAULT" is returned, no callback is executed
            const permission = Push.Permission.request(onGranted, onDenied);
            if (permission === Push.Permission.DEFAULT) {
                this.setState({ pushPermission: Push.Permission.DEFAULT });
            }
        },
        checkForUpdates: async () => {
            try {
                const res = await api.getState();
                const { checkForUpdates, prereleases } = res.body;

                if (checkForUpdates) {
                    const versionInfo = await api.getLatestVersion(prereleases);
                    this._isMounted && this.setState(versionInfo);
                }
            } catch (res) {
                // Ignore error
            }
        },
        fetchCommands: async () => {
            try {
                const res = await api.commands.fetch({ paging: false });
                const { records: commands } = res.body;

                this._isMounted && this.setState({
                    commands: commands.filter(command => command.enabled)
                });
            } catch (res) {
                // Ignore error
            }
        },
        runCommand: async (cmd) => {
            try {
                const res = await api.commands.run(cmd.id);
                const { taskId } = res.body;

                this.setState({
                    commands: this.state.commands.map(c => {
                        return (c.id === cmd.id) ? { ...c, taskId: taskId, err: null } : c;
                    })
                });
            } catch (res) {
                // Ignore error
            }
        }
    };

    actionHandlers = {
        CONTROLLER_COMMAND: (event, { command }) => {
            // feedhold, cyclestart, homing, unlock, reset
            this.workspace.controller.command(command);
        }
    };

    controllerEvents = {
        'config:change': () => {
            this.actions.fetchCommands();
        },
        'task:start': (taskId) => {
            this.setState({
                runningTasks: this.state.runningTasks.concat(taskId)
            });
        },
        'task:finish': (taskId, code) => {
            const err = (code !== 0) ? new Error(`errno=${code}`) : null;
            let cmd = null;

            this.setState({
                commands: this.state.commands.map(c => {
                    if (c.taskId !== taskId) {
                        return c;
                    }
                    cmd = c;
                    return {
                        ...c,
                        taskId: null,
                        err: err
                    };
                }),
                runningTasks: without(this.state.runningTasks, taskId)
            });

            if (cmd && this.state.pushPermission === Push.Permission.GRANTED) {
                Push.create(cmd.title, {
                    body: code === 0
                        ? i18n._('Command succeeded')
                        : i18n._('Command failed ({{err}})', { err: err }),
                    icon: 'images/logo-badge-32x32.png',
                    timeout: 10 * 1000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                });
            }
        },
        'task:error': (taskId, err) => {
            let cmd = null;

            this.setState({
                commands: this.state.commands.map(c => {
                    if (c.taskId !== taskId) {
                        return c;
                    }
                    cmd = c;
                    return {
                        ...c,
                        taskId: null,
                        err: err
                    };
                }),
                runningTasks: without(this.state.runningTasks, taskId)
            });

            if (cmd && this.state.pushPermission === Push.Permission.GRANTED) {
                Push.create(cmd.title, {
                    body: i18n._('Command failed ({{err}})', { err: err }),
                    icon: 'images/logo-badge-32x32.png',
                    timeout: 10 * 1000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                });
            }
        }
    };

    _isMounted = false;

    getInitialState() {
        let pushPermission = '';
        try {
            // Push.Permission.get() will throw an error if Push is not supported on this device
            pushPermission = Push.Permission.get();
        } catch (e) {
            // Ignore
        }

        return {
            pushPermission: pushPermission,
            commands: [],
            runningTasks: [],
            latestVersion: { readable: '' },
            lastUpdate: '',
            updateAvailable: false,
            updateUrl: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;

        this.addActionHandlers();
        if (this.workspace) {
            this.workspace.addControllerEvents(this.controllerEvents);
        }

        // Initial actions
        this.actions.checkForUpdates();
        this.actions.fetchCommands();
    }

    componentWillUnmount() {
        this._isMounted = false;

        this.removeActionHandlers();
        if (this.workspace) {
            this.workspace.removeControllerEvents(this.controllerEvents);
        }

        this.runningTasks = [];
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            const lastWorkspace = Workspaces.findByPath(prevProps.location.pathname);
            if (lastWorkspace) {
                lastWorkspace.removeControllerEvents(this.controllerEvents);
            }
            if (this.workspace) {
                this.workspace.addControllerEvents(this.controllerEvents);
            }
        }
        return true;
    }

    addActionHandlers() {
        Object.keys(this.actionHandlers).forEach(eventName => {
            const callback = this.actionHandlers[eventName];
            combokeys.on(eventName, callback);
        });
    }

    removeActionHandlers() {
        Object.keys(this.actionHandlers).forEach(eventName => {
            const callback = this.actionHandlers[eventName];
            combokeys.removeListener(eventName, callback);
        });
    }

    render() {
        const { history, location } = this.props;
        const { pushPermission, commands, runningTasks, updateAvailable, updateUrl, latestVersion, lastUpdate } = this.state;
        const sessionEnabled = store.get('session.enabled');
        const signedInName = store.get('session.name');
        const hideUserDropdown = !sessionEnabled;
        const showCommands = commands.length > 0;
        const workspace = Workspaces.findByPath(location.pathname);
        const updateMsg = i18n._('A new version of {{name}} is available', { name: settings.productName }) + '. ' +
            i18n._('Version {{version}}', { version: latestVersion.readable }) +
            ` (${moment(lastUpdate).format('LLL')})`;

        return (
            <Navbar
                fixedTop
                fluid
                style={{
                    margin: 0
                }}
            >
                <Navbar.Header style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        style={{
                            margin: '4px auto 0 auto',
                            width: '42px'
                        }}
                        src="images/logo-badge-32x32.png"
                        alt=""
                    />
                    <h1 style={{ color: '#222', marginLeft: '15px', marginTop: 0, marginBottom: 0, fontSize: '30px', fontWeight: '600' }}>Makerverse</h1>
                    {updateAvailable && (
                        <Tooltip
                            placement="bottom"
                            id="navbarBrandTooltip"
                            style={{ color: '#fff' }}
                            content={updateMsg}
                        >
                            <div style={{ marginTop: '-15px', paddingLeft: '10px' }}>
                                <a href={updateUrl} target="_blank" rel="noopener noreferrer">
                                    {i18n._('New update available')}
                                </a>
                            </div>
                        </Tooltip>
                    )}
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavDropdown
                            className={classNames(
                                { 'hidden': hideUserDropdown }
                            )}
                            id="nav-dropdown-user"
                            title={(
                                <div title={i18n._('My Account')}>
                                    <i className="fa fa-fw fa-user" />
                                </div>
                            )}
                            noCaret
                        >
                            <MenuItem header>
                                {i18n._('Signed in as {{name}}', { name: signedInName })}
                            </MenuItem>
                            <MenuItem divider />
                            <MenuItem
                                href="#/settings/user-accounts"
                            >
                                <i className="fa fa-fw fa-user" />
                                <Space width="8" />
                                {i18n._('Account')}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    if (user.isAuthenticated()) {
                                        log.debug('Destroy and cleanup the WebSocket connection');
                                        Workspaces.disconnect();

                                        user.signout();

                                        // Remember current location
                                        history.replace(location.pathname);
                                    }
                                }}
                            >
                                <i className="fa fa-fw fa-sign-out" />
                                <Space width="8" />
                                {i18n._('Sign Out')}
                            </MenuItem>
                        </NavDropdown>
                        <NavDropdown
                            id="nav-dropdown-menu"
                            title={(
                                <div title={i18n._('Options')}>
                                    <i className="fa fa-fw fa-ellipsis-v" />
                                    {this.state.runningTasks.length > 0 && (
                                        <span
                                            className="label label-primary"
                                            style={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4
                                            }}
                                        >
                                        N
                                        </span>
                                    )}
                                </div>
                            )}
                            noCaret
                        >
                            {showCommands && (
                                <MenuItem header>
                                    {i18n._('Command')}
                                    {pushPermission === Push.Permission.GRANTED && (
                                        <span className="pull-right">
                                            <i className="fa fa-fw fa-bell-o" />
                                        </span>
                                    )}
                                    {pushPermission === Push.Permission.DENIED && (
                                        <span className="pull-right">
                                            <i className="fa fa-fw fa-bell-slash-o" />
                                        </span>
                                    )}
                                    {pushPermission === Push.Permission.DEFAULT && (
                                        <span className="pull-right">
                                            <Anchor
                                                className={styles.btnIcon}
                                                onClick={this.actions.requestPushPermission}
                                                title={i18n._('Show notifications')}
                                            >
                                                <i className="fa fa-fw fa-bell" />
                                            </Anchor>
                                        </span>
                                    )}
                                </MenuItem>
                            )}
                            {showCommands && commands.map((cmd) => {
                                const isTaskRunning = runningTasks.indexOf(cmd.taskId) >= 0;

                                return (
                                    <MenuItem
                                        key={cmd.id}
                                        disabled={cmd.disabled}
                                        onSelect={() => {
                                            this.actions.runCommand(cmd);
                                        }}
                                    >
                                        <span title={cmd.command}>{cmd.title || cmd.command}</span>
                                        <span className="pull-right">
                                            <i
                                                className={classNames(
                                                    'fa',
                                                    'fa-fw',
                                                    { 'fa-circle-o-notch': isTaskRunning },
                                                    { 'fa-spin': isTaskRunning },
                                                    { 'fa-exclamation-circle': cmd.err },
                                                    { 'text-error': cmd.err }
                                                )}
                                                title={cmd.err}
                                            />
                                        </span>
                                    </MenuItem>
                                );
                            })}
                            {showCommands &&
                            <MenuItem divider />
                            }
                            <MenuItem
                                href="https:/makerverse.com/help"
                                target="_blank"
                            >
                                {i18n._('Help')}
                            </MenuItem>
                            {/* <MenuItem
                                href="https://github.com/cncjs/cncjs/issues"
                                target="_blank"
                            >
                                {i18n._('Report an issue')}
                            </MenuItem> */}
                        </NavDropdown>
                    </Nav>
                    {workspace &&
                    <QuickAccessToolbar workspaceId={workspace.id} state={this.state} actions={this.actions} />
                    }
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default withRouter(Header);
