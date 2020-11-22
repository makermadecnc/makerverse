import {WorkspaceActionTypes, WorkspaceState} from './types';

const initialState: WorkspaceState = {
  currentWorkspaceId: undefined
};

export function workspaceReducer(state = initialState, action: WorkspaceActionTypes): WorkspaceState {
  return state;
}

export default {};
