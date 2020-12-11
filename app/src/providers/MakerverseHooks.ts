import _ from 'lodash';
import React from 'react';
import {IMakerverse, MakerverseContext} from '../lib/Makerverse';
import {Workspace} from '../lib/workspaces';
import {BackendConnection, BackendConnectionEvent, ConnectionState} from '../lib/Makerverse/apollo';
import {IWorkspaceEvent, WorkspaceEventType} from '../lib/workspaces/types';
import {TTranslateFunc} from '@openworkshop/lib';

export function useMakerverse(): IMakerverse {
  return React.useContext(MakerverseContext);
}

export function useMakerverseTrans(): TTranslateFunc {
  return useMakerverse().t;
}

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

export function useWorkspaceEvent(workspace: Workspace, type: WorkspaceEventType): IWorkspaceEvent | undefined {
  const [event, setEvent] = React.useState<IWorkspaceEvent | undefined>(undefined);

  React.useEffect(() => {
    workspace.on(type.toString(), setEvent);

    return function cleanup() {
      workspace.off(type.toString(), setEvent);
    };
  }, [workspace, type, event, setEvent]);

  return event;
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

// Hook
export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}
