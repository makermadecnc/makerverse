import Settings from 'containers/Settings';
import Workspaces from './workspaces';

const isStaticPath = (location) => {
    return Settings.paths.concat([
        '/home',
        '/settings',
    ]).includes(location.pathname);
};

const isWorkspacePath = (location) => {
    return Object.keys(Workspaces.all).map((workspaceId) => {
        return Workspaces.all[workspaceId].path;
    }).includes(location.pathname);
};

const checkPath = (location) => {
    return isWorkspacePath(location) || isStaticPath(location);
};

export {
    isWorkspacePath,
    isStaticPath,
    checkPath,
};
