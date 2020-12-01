import { useLogger } from '@openworkshop/lib/utils/logging/UseLogger';
import React from 'react';
import {Route, Switch, useLocation } from 'react-router-dom';
import {usePortStatusSubscription} from '../api/graphql';
import analytics from '../lib/analytics';
import settings from '../config/settings';
import {MakerverseContext} from '../lib/Makerverse';
import { Settings, Home, WorkspaceCreator, Docs, Workspace } from './';
import Navigation, { NotFound } from 'components/Navigation';
import {tryUseWorkspace} from '../providers';

interface IProps {
  currentWorkspaceId?: string;
}

const App: React.FunctionComponent<IProps> = (props) => {
  const log = useLogger(App);
  const makerverse = React.useContext(MakerverseContext);
  const workspaceIds = makerverse.workspaces.map(ws => ws.id);
  const workspace = tryUseWorkspace(props.currentWorkspaceId);
  const location = useLocation();

  React.useEffect(() => {
    log.trace('app workspace', location.pathname, 'workspace', workspace?.id);

    if (workspace) {
      document.title = `${workspace.name} | ${settings.productName}`;
      const parts = [workspace.connection.firmware.controllerType];
      analytics.trackPage('/' + parts.join('/') + '/');
    } else {
      document.title = settings.productName;
      analytics.trackPage(location.pathname);
    }

  }, [analytics, log, workspace]);

  return (
    <Navigation>
      <Switch>
        {workspaceIds.map((workspaceId) => {
          return (
            <Route exact key={workspaceId} path={`/workspaces/${workspaceId}`} >
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
