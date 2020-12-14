import * as owsStore from '@openworkshop/lib/store';
import { Store } from 'redux';
// import {makerverseReducer} from '../lib/Makerverse/reducers';
// import {IMakerverseState} from '../lib/Makerverse/types';

// The top-level state object
export type AppState = owsStore.IOwsState; // & IMakerverseState;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function configureStore(): Store<AppState> {
  const enhancers = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
  const windowIfDefined = typeof window === 'undefined' ? null : (window as any);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return owsStore.configureStore<AppState>(
    {
      // makerverse: makerverseReducer,
    },
    [ ],
    enhancers,
  );
}
