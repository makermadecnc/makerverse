import React from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';
import log from 'app/lib/log';

const ProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            if (props.user) {
                log.debug('User is authenticated.', props.user);
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

function mapStateToProps(state) {
    return {
        user: state.oidc.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
