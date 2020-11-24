import { useLogger } from '@openworkshop/lib/utils/logging/UseLogger';
import React from 'react';
import {Route, Switch, useLocation } from 'react-router-dom';
import analytics from '../lib/analytics';
import settings from '../config/settings';
import {useWorkspaces, Workspaces} from '../lib/Makerverse';
import { Settings, Home, WorkspaceCreator, Docs, Workspace } from './';
import Navigation, { NotFound } from 'components/Navigation';

export default function App() {
  const log = useLogger(App);
  const location = useLocation();
  const workspaces: Workspaces = useWorkspaces();
  const workspaceIds = Object.keys(workspaces.all);

  React.useEffect(() => {
    workspaces.current = workspaces.findByPath(location.pathname);
    analytics.trackPage(location, workspaces.current);

    log.debug('app workspace', workspaces.current, 'location', location);

    if (workspaces.current) {
      document.title = `${workspaces.current.name} | ${settings.productName}`;
    } else {
      document.title = settings.productName;
    }

  }, [analytics, log, workspaces]);

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
}
