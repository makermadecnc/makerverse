import {Workspace} from '../../lib/workspaces';

export interface IHaveWorkspaceId {
  workspaceId: string;
}

export interface IMaybeHaveWorkspace {
  workspace?: Workspace;
}

export interface IHaveWorkspace {
  workspace: Workspace;
}

export interface IWorkspaceSettingsTab {
  key: string;

  title: string;

  component: React.ReactNode,
}
