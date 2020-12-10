import React, { PureComponent } from 'react';
import { CallbackComponent } from 'redux-oidc';
import { Redirect } from 'react-router-dom';
import auth from 'lib/auth';
import analytics from 'lib/analytics';
import { connect } from 'react-redux';
import styles from './index.styl';

class Callback extends PureComponent {
    state = { error: null, success: false, ready: false };

    handleSuccess(oidc) {
        this.setState({ success: true });
        analytics.event({
            category: 'interaction',
            action: 'logged-in',
        });

        auth.signin(oidc).then(({ success, error }) => {
            if (success) {
                this.setState({ ready: true });
            } else {
                const err = error ?? { message: 'Failed to authenticate.' };
                this.setState({ error: err });
            }
        });
    }

    handleError(err) {
        this.setState({ error: err });
        analytics.event({
            category: 'interaction',
            action: 'login-error',
            label: err.message ?? `${err}`,
        });
    }

    renderInner() {
        if (this.state.error) {
            const msg = this.state.error.message ?? this.state.error;
            return <Redirect to={`/login?error=${msg}`} />;
        }

        if (this.state.success) {
            if (!this.state.ready) {
                return <div>Loading Profile...</div>;
            }
            return <Redirect to="/" />;
        }

        return (
            <CallbackComponent
                userManager={this.props.owsCore.authManager}
                successCallback={(s) => this.handleSuccess(s)}
                errorCallback={(e) => this.handleError(e)}
            >
                <div>Authenticating...</div>
            </CallbackComponent>
        );
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.login} style={{ padding: '20px' }}>
                    {this.renderInner()}
                </div>
            </div>
        );
    }
}

export default connect()(Callback);
