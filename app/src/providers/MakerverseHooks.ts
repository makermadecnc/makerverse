import _ from 'lodash';
import React from 'react';
import {MakerverseContext} from '../lib/Makerverse';
import {Workspace} from '../lib/workspaces';

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
