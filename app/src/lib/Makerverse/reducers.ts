import {SET_WORKSPACE, SET_TOKEN, MakerverseActionTypes, IMakerverseState} from './types';

const initialState: IMakerverseState = {
  token: undefined,
  currentWorkspaceId: undefined,
};

export function makerverseReducer(state = initialState, action: MakerverseActionTypes): IMakerverseState {
  if (action.type === SET_WORKSPACE) {
    return { currentWorkspaceId: action.payload.id };
  }
  if (action.type === SET_TOKEN) {
    return { token: action.payload.token };
  }
  return state;
}

export default {};
