import {ISetWorkspace, SET_WORKSPACE, WorkspaceActionTypes} from './types';

export function setWorkspace(params: ISetWorkspace): WorkspaceActionTypes {
  return {
    type: SET_WORKSPACE,
    payload: params,
  };
}
