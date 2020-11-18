import * as owsStore from '@openworkshop/lib/store';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { Store } from 'redux';

// The top-level state object
export type AppState = owsStore.IOwsState;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function configureStore(history: History, initialState?: AppState): Store<AppState> {
  const enhancers = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any
  const windowIfDefined = typeof window === 'undefined' ? null : (window as any);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (windowIfDefined && windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    enhancers.push(windowIfDefined.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return owsStore.configureStore(
    { router: connectRouter(history) },
    [routerMiddleware(history)],
    enhancers,
    initialState,
  );
}
