import _ from 'lodash';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import {Redirect, Route, Switch, useLocation, Link } from 'react-router-dom';
import {OpenWorkShop} from '@openworkshop/lib';
import {
  MakerverseEssentialSettingsFragment, MakerverseSessionFragment,
} from '../api/graphql';
import i18nConfig from '../config/i18n';
import analytics from '../lib/analytics';
import {IMakerverse, MakerverseContext} from '../lib/Makerverse';
import { LoginPage, CallbackPage } from 'components/Login';
import usePromise from 'react-promise-suspense';
import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Workspace } from 'lib/workspaces';
import {MakerverseSubscription} from '../lib/Makerverse/apollo';
import {AppState} from '../store/redux';
import ProtectedApp from './ProtectedApp';
import { useSelector } from 'react-redux';
import { User } from 'oidc-client';

// Hook for children...
export function useWorkspace(workspaceId?: string): Workspace | undefined {
  const makerverse = React.useContext(MakerverseContext); // must happen despite early return in order to obey hooks
  if (!workspaceId) return undefined;
  return _.find(makerverse.workspaces, ws => ws.id === workspaceId);
}

const workspaceObjects: { [key: string]: Workspace } = {};

interface IProps {
  connection: MakerverseSubscription;
}

const MakerverseProvider: FunctionComponent<IProps> = (props) => {
  const log = useLogger(MakerverseProvider);
  const ows = React.useContext(OpenWorkShop);
  const { connection } = props;
  const location = useLocation();
  const [settings, setSettings] = React.useState<MakerverseEssentialSettingsFragment | undefined>(undefined);
  const [session, setSession] = React.useState<MakerverseSessionFragment | undefined>(undefined);

  const user = useSelector<AppState, User | undefined>((state) => state.oidc.user);
  const token = user ? user.access_token : undefined;

  // Load/unload workspaces
  const workspaceRecords = settings?.workspaces ?? [];
  const currentWorkspaceIds = workspaceRecords.map(ws => ws.id);
  const previousWorkspaceIds = Object.keys(workspaceObjects);
  const newWorkspaceIds = _.difference(currentWorkspaceIds, previousWorkspaceIds);
  const removedWorkspaceIds = _.difference(previousWorkspaceIds, currentWorkspaceIds);

  removedWorkspaceIds.forEach(id => {
    log.debug('unload workspace', id);
    delete workspaceObjects[id];
  });

  newWorkspaceIds.forEach(id => {
    const record = _.find(workspaceRecords, r => r.id === id);
    if (record) {
      log.debug('load workspace', id);
      workspaceObjects[id] = new Workspace(ows, record);
    } else {
      log.error('missing workspace', id);
    }
  });

  const workspaces = Object.values(workspaceObjects);
  const wsPrefix = '/workspaces/';
  const path = location.pathname;
  const currentWorkspaceId = path.startsWith(wsPrefix) ? path.substring(wsPrefix.length) : undefined;

  // Set up the IMakerverse interface for the .Provider...
  log.debug('makerveres', connection);
  const makerverse: IMakerverse = { ows, connection, session, workspaces };

  usePromise(async () => {
    log.debug('loading...');
    await i18next.use(XHR).use(LanguageDetector).init(i18nConfig);
    analytics.initialize(ows);
  }, []);

  function onLoaded(u: MakerverseSessionFragment, s: MakerverseEssentialSettingsFragment) {
    log.debug('loaded', 'session', !!u, 'settings', !!s);
    setSession(u);
    setSettings(s);
  }

  return (
    <MakerverseContext.Provider value={makerverse} >
      <Switch>
        <Route path='/login' component={LoginPage} />
        <Route path='/callback' component={CallbackPage} />
        {user && <Route path='/' >
          <ProtectedApp token={user.access_token} onLoaded={onLoaded} currentWorkspaceId={currentWorkspaceId} />
        </Route>}
        {!user && <Route path='/'>
          <Redirect to="/login" />
        </Route>}
      </Switch>
    </MakerverseContext.Provider>
  );
};

export default MakerverseProvider;
