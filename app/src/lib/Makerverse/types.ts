
export const SET_WORKSPACE = 'SET_WORKSPACE';
export const SET_TOKEN = 'SET_TOKEN';

export interface ISetWorkspace {
  id?: string;
}

export interface ISetToken {
  token?: string;
}

interface SetWorkspaceAction {
  type: typeof SET_WORKSPACE,
  payload: ISetWorkspace,
}

interface SetTokenAction {
  type: typeof SET_TOKEN;
  payload: ISetToken;
}

export type MakerverseActionTypes = SetWorkspaceAction | SetTokenAction;

export interface IMakerverseState {
  token?: string;
  currentWorkspaceId?: string;
}
