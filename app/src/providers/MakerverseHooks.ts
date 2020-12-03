import _ from 'lodash';
import React from 'react';
import {IMakerverse, MakerverseContext} from '../lib/Makerverse';
import {Workspace} from '../lib/workspaces';
import {BackendConnection, BackendConnectionEvent, ConnectionState} from '../lib/Makerverse/apollo';

export function useWorkspace(workspaceId: string): Workspace {
  const makerverse = React.useContext(MakerverseContext); // must happen despite early return in order to obey hooks
  const workspace: Workspace | undefined = _.find(makerverse.workspaces, ws => ws.id === workspaceId);
  if (!workspace) throw new Error(`No workspace for: ${workspaceId}`);
  return workspace;
}

export function tryUseWorkspace(workspaceId?: string): Workspace | undefined {
  const makerverse = React.useContext(MakerverseContext); // must happen despite early return in order to obey hooks
  if (!workspaceId) return undefined;
  return _.find(makerverse.workspaces, ws => ws.id === workspaceId);
}

// Get notified when the backend connection (to Makerverse) state changes.
export function useBackendConnectionState(): ConnectionState {
  const makerverse: IMakerverse = React.useContext(MakerverseContext);
  const conn: BackendConnection = makerverse.connection;
  const [state, setState] = React.useState<ConnectionState>(conn.state);
  const eventName = BackendConnectionEvent.ConnectionStateChanged.toString();
  React.useEffect(() => {
    conn.on(eventName, setState);

    return function cleanup() {
      conn.off(eventName, setState);
    };
  }, [conn]);
  return state;
}
