import React, { PureComponent } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { trackPage } from '../lib/analytics';
import Header from './Header';
import Sidebar from './Sidebar';
import Workspace from './Workspace';
import Home from './Home';
import Settings from './Settings';
import styles from './App.styl';
import Workspaces from '../lib/workspaces';

class App extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes
    };

    render() {
        const { location } = this.props;
        const workspacePaths = Object.keys(Workspaces.all).map((workspaceId) => {
            return Workspaces.all[workspaceId].path;
        });
        const staticPaths = [
            '/home',
            '/settings',
            '/settings/general',
            '/settings/workspace',
            '/settings/machine-profiles',
            '/settings/user-accounts',
            '/settings/controller',
            '/settings/commands',
            '/settings/events',
            '/settings/about'
        ];
        const isWorkspace = workspacePaths.indexOf(location.pathname) >= 0;
        const isStaticPath = staticPaths.indexOf(location.pathname) >= 0;
        const accepted = isWorkspace || isStaticPath;

        if (!accepted) {
            return (
                <Redirect
                    to={{
                        pathname: '/home',
                        state: {
                            from: location
                        }
                    }}
                />
            );
        }

        trackPage(location.pathname);

        return (
            <div>
                <Header {...this.props} />
                <aside className={styles.sidebar} id="sidebar">
                    <Sidebar {...this.props} />
                </aside>
                <div className={styles.main}>
                    <div className={styles.content}>
                        <Home
                            {...this.props}
                            isActive={location.pathname === '/home'}
                            style={{
                                display: (location.pathname !== '/home') ? 'none' : 'block'
                            }}
                        />
                        {Object.keys(Workspaces.all).map((workspaceId) => {
                            const workspace = Workspaces.all[workspaceId];
                            workspace.isActive = location.pathname === workspace.path;
                            return (
                                <Workspace
                                    {...this.props}
                                    key={workspaceId}
                                    workspaceId={workspaceId}
                                    style={{
                                        display: workspace.isActive ? 'block' : 'none'
                                    }}
                                />
                            );
                        })}
                        {location.pathname.indexOf('/settings') === 0 &&
                            <Settings {...this.props} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(App);
