import React from 'react';
import log from 'js-logger';
// import PropTypes from 'prop-types';
import auth from 'lib/auth';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (auth.isAuthenticated()) {
        return Component ? <Component {...rest} /> : null;
      }

      const redirectFrom = props.location.pathname;
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
              from: props.location,
            },
          }}
        />
      );
    }}
  />
);

ProtectedRoute.propTypes = {
  ...withRouter.propTypes,
};

export default connect()(ProtectedRoute);
