import {
  ISetWorkspace, SET_WORKSPACE,
  ISetToken, SET_TOKEN,
  MakerverseActionTypes
} from './types';

export function setWorkspace(params: ISetWorkspace): MakerverseActionTypes {
  return {
    type: SET_WORKSPACE,
    payload: params,
  };
}

export function setToken(params: ISetToken): MakerverseActionTypes {
  return {
    type: SET_TOKEN,
    payload: params,
  };
}
