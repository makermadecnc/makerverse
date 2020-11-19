import OpenWorkShopContext from '@openworkshop/lib/OpenWorkShopContext';
import ProtectedRoute from 'components-old/ProtectedRoute';
import React, { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import App from './App';
import LoginPage from 'components/Login/LoginPage';
import Callback from './Login/Callback';
import { checkPath } from 'lib/paths';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';

const Routes: FunctionComponent = () => {
  const log = useLogger(Routes);
  const owsCore = React.useContext(OpenWorkShopContext);

  if (!checkPath(location)) {
    log.warn('invalid location', location);
    return <Redirect to='/home' />;
  }

  return (
    <Switch>
      <Route path='/login' component={LoginPage} />
      <Route path='/callback'>
        <Callback owsCore={owsCore} />
      </Route>
      <ProtectedRoute path='/' component={App} />
    </Switch>
  );
};

export default Routes;
