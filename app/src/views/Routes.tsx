import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import { LoginPage, CallbackPage } from 'components/Login';
import { ProtectedRoute } from 'components/Navigation';

const Routes: FunctionComponent = () => {
  // const log = useLogger(Routes);

  return (
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path='/callback' component={CallbackPage} />
      <ProtectedRoute path='/' component={App} />
    </Switch>
  );
};

export default Routes;
