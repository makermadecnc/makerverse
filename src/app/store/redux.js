import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import * as Oidc from 'redux-oidc';
import OidcClient from 'oidc-client';

const reducers = {
};

// This is pretty ugly. The CNCjs app had a concept of a "store," then Redux was added.
// The two should be unufied.
export default function configureStore(history, initialState) {
    OidcClient.Log.logger = console;
    OidcClient.Log.level = OidcClient.Log.DEBUG;

    const middleware = [];

    const rootReducer = combineReducers({
        ...reducers,
        oidc: Oidc.reducer,
    });

    const enhancers = [];

    const store = createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware), ...enhancers)
    );

    return store;
}
