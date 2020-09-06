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
import { checkPath } from '../lib/paths';
import settings from '../config/settings';

class App extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes
    };

    render() {
        const { location } = this.props;
        if (!checkPath(location)) {
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

        const workspace = Workspaces.findByPath(location.pathname);
        if (workspace) {
            document.title = `${workspace.name} | ${settings.productName}`;
        } else {
            document.title = settings.productName;
        }

        trackPage(location);

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
