import { useLogger } from '@openworkshop/lib/utils/logging/UseLogger';
import React from 'react';
import {Route, Switch, useLocation } from 'react-router-dom';
import analytics from '@openworkshop/ui/open-controller/analytics';
import settings from '../config/settings';
import { Settings, Home, WorkspaceCreator, Docs, Workspace } from './';
import Navigation, { NotFound } from '../components/Navigation';
import BackendDiconnectedModal from '@openworkshop/ui/open-controller/Modals/BackendDiconnectedModal';
import _ from 'lodash';
import {useOpenController} from '@openworkshop/ui/open-controller/Context';

interface IProps {
  currentWorkspaceId?: string;
}

const App: React.FunctionComponent<IProps> = (props) => {
  const log = useLogger(App);
  const makerverse = useOpenController();
  const workspaceIds = makerverse.workspaces.map(ws => ws.id);
  const { currentWorkspaceId } = props;
  const workspace = _.find(makerverse.workspaces, ws => ws.id === currentWorkspaceId);
  const location = useLocation();

  function toggleWorkspaceActiveFlags(activeWorkspaceId?: string) {
    makerverse.workspaces.forEach((ws) => {
      ws.isActive = Boolean(activeWorkspaceId && ws.id === activeWorkspaceId);
    });
  }

  function setPage(title: string, pathname: string) {
    document.title = title;
    analytics.trackPage(pathname);
    toggleWorkspaceActiveFlags(currentWorkspaceId);
  }

  React.useEffect(() => {
    log.verbose('app workspace', location.pathname, 'workspace', workspace?.id);

    if (workspace) {
      setPage(
        `${workspace.name} | ${settings.productName}`,
        '/' + [workspace.connection.firmware.controllerType].join('/') + '/'
      );
    } else {
      setPage(settings.productName, location.pathname);
    }
  }, [analytics, log, workspace]);

  return (
    <Navigation workspace={workspace}>
      <BackendDiconnectedModal />
      <Switch>
        {workspaceIds.map((workspaceId) => {
          return (
            <Route exact key={workspaceId} path={`/workspaces/${workspaceId}/:selectedToolGroupId?`} >
              <Workspace id={workspaceId} />
            </Route>
          );
        })}
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/workspaces" component={WorkspaceCreator} />
        <Route exact path="/docs" component={Docs} />
        <Route exact path="/" component={Home} />
        <Route path="/" component={NotFound} />
      </Switch>
    </Navigation>
  );
};

export default App;
