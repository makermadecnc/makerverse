import WorkspaceAxis from './workspace-axis';

export type ControllerEventMap = { [key: string]: () => void };

export type WorkspaceAxisMap = { [key: string]: WorkspaceAxis };

export enum WorkspaceEventType {
  State,
}

export interface IWorkspaceEvent {
  type: WorkspaceEventType;
}
