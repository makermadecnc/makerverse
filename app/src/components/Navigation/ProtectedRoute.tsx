import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import auth from 'lib/auth';
import React, { FunctionComponent } from 'react';
import { Redirect, Route } from 'react-router-dom';

interface OwnProps {
  path: string;
  component: React.ComponentClass<unknown, unknown> | React.FunctionComponent<unknown>;
}

type Props = OwnProps;

const ProtectedRoute: FunctionComponent<Props> = (props) => {
  const log = useLogger(ProtectedRoute);

  if (auth.isAuthenticated()) {
    return <Route path={props.path} component={props.component} />;
  }

  const redirectFrom = window.location.pathname;
  const redirectTo = '/login';
  if (redirectFrom === redirectTo) {
    return null;
  }

  log.debug(`Redirect from "${redirectFrom}" to "${redirectTo}"`);

  return (
    <Redirect
      to={{
        pathname: '/login',
        state: {
          from: props.path,
        },
      }}
    />
  );
};

export default ProtectedRoute;
