import classNames from 'classnames';
import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import i18n from 'app/lib/i18n';
import styles from './index.styl';
import Workspaces from '../../lib/workspaces';

class Sidebar extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes
    };

    render() {
        const { pathname = '' } = this.props.location;

        return (
            <nav className={styles.navbar}>
                <ul className={styles.nav}>
                    <li
                        className={classNames(
                            'text-center',
                            { [styles.active]: pathname.indexOf('/home') === 0 }
                        )}
                    >
                        <Link to="/home" title={i18n._('Home')}>
                            <i
                                className={classNames(
                                    styles.icon,
                                    styles.iconHome
                                )}
                            />
                        </Link>
                    </li>
                    {Object.keys(Workspaces.all).map((workspaceId) => {
                        const workspace = Workspaces.all[workspaceId];
                        return (
                            <li
                                key={workspace.path}
                                className={classNames(
                                    'text-center',
                                    { [styles.active]: pathname.indexOf(workspace.path) === 0 }
                                )}
                            >
                                <Link to={workspace.path} title={workspace.name}>
                                    <i
                                        className={classNames(
                                            styles.icon,
                                        )}
                                        style={{ background: `url("${workspace.icon}") no-repeat 0 0` }}
                                    />
                                </Link>
                            </li>
                        );
                    })}
                    <li
                        className={classNames(
                            'text-center',
                            { [styles.active]: pathname.indexOf('/settings') === 0 }
                        )}
                    >
                        <Link to="/settings" title={i18n._('Settings')}>
                            <i
                                className={classNames(
                                    styles.icon,
                                    styles.iconGear
                                )}
                            />
                        </Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default withRouter(Sidebar);
