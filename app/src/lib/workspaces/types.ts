import {WorkspaceFullSettingsFragment} from '../../api/graphql';
import WorkspaceAxis from './workspace-axis';

export type ControllerEventMap = { [key: string]: () => void };

export type WorkspaceAxisMap = { [key: string]: WorkspaceAxis };

export type WorkspaceRecord = WorkspaceFullSettingsFragment;
