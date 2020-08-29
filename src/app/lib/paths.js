import Settings from 'app/containers/Settings';
import Workspaces from './workspaces';

const checkPath = (location) => {
    const workspacePaths = Object.keys(Workspaces.all).map((workspaceId) => {
        return Workspaces.all[workspaceId].path;
    });
    const staticPaths = Settings.paths.concat([
        '/home',
        '/settings',
    ]);
    const isWorkspace = workspacePaths.includes(location.pathname);
    const isStaticPath = staticPaths.includes(location.pathname);
    return isWorkspace || isStaticPath;
};

export {
    checkPath
};
