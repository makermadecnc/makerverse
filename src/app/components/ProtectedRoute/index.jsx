import React from 'react';
// import PropTypes from 'prop-types';
import auth from 'app/lib/auth';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import log from 'app/lib/log';

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
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
                            from: props.location
                        }
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
