import {
  MachineAxis,
  MachineFeaturePropsFragment,
  MachineFirmwarePropsFragment,
  MachinePartCompleteFragment
} from '@openworkshop/lib/api/graphql';
import {IPortOpts} from '@openworkshop/open-controller/MachineController';
import WorkspaceAxis from './workspace-axis';

export type Firmware = MachineFirmwarePropsFragment & IPortOpts;

export interface IWorkspaceRecord {
  id: string;
  path: string;
  name: string;
  icon: string;
  color: string;
  bkColor: string;
  onboarded: boolean;
  autoReconnect: boolean;
  axes: { [key: string]: MachineAxis };
  firmware: Firmware;
  parts: MachinePartCompleteFragment[];
  features: FeatureMap;
  commands: WorkspaceCommands;
}

export type WorkspaceCommands = { [key: string]: string[] };

export type ControllerEventMap = { [key: string]: () => void };

export type WorkspaceAxisMap = { [key: string]: WorkspaceAxis };

export type FeatureMap = { [key: string]: MachineFeaturePropsFragment | false };

export type WorkspaceRecord = IWorkspaceRecord;

export const SET_WORKSPACE = 'SET_WORKSPACE';

export interface ISetWorkspace {
  id?: string;
}

interface SetWorkspaceAction {
  type: typeof SET_WORKSPACE,
  payload: ISetWorkspace,
}

export type WorkspaceActionTypes = SetWorkspaceAction;

export interface WorkspaceState {
  currentWorkspaceId?: string;
}
