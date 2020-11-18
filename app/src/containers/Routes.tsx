import OpenWorkShopContext from '@openworkshop/lib/OpenWorkShopContext';
import ProtectedRoute from 'components-old/ProtectedRoute';
import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './App';
import LoginPage from 'components/Login/LoginPage';
import Callback from './Login/Callback';

interface OwnProps {
  children: React.ReactNode;
}
type Props = OwnProps;

const Routes: FunctionComponent<Props> = (props) => {
  const owsCore = React.useContext(OpenWorkShopContext);

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
