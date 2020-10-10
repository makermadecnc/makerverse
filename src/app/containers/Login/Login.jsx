import cx from 'classnames';
import qs from 'qs';
import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Anchor from 'app/components/Anchor';
import Space from 'app/components/Space';
// import settings from 'app/config/settings';
// import Workspaces from 'app/lib/workspaces';
// import promisify from 'app/lib/promisify';
// import auth from 'app/lib/auth';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import auth from 'app/lib/auth';
// import store from 'app/store';
import styles from './index.styl';

class Login extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes
    };

    state = this.getDefaultState();

    processErrors = (errors) => {
        const errs = this.emptyErrors;
        const registering = this.state.registering;
        let verificationRequired = false;
        errors.forEach((err) => {
            const str = err.code ? err.code.toLowerCase() : '';
            let key = 'unknown';
            if (str === 'notallowed') {
                verificationRequired = true;
                return;
            } else if (str.includes('email')) {
                key = 'email';
            } else if (str.includes('password')) {
                key = 'password';
            } else if (str.includes('username')) {
                key = 'username';
            }
            errs[key].push(err.message ?? err);
        });
        const msg = i18n._(registering ? 'Registration failed.' : 'Authentication failed.');
        this.setState({
            registered: verificationRequired,
            alertMessage: verificationRequired ? null : msg,
            authenticating: false,
            redirectToReferrer: false,
            errors: verificationRequired ? this.emptyErrors : errs,
        });
    }

    actions = {
        handleSignIn: (event) => {
            event.preventDefault();

            this.setState({
                alertMessage: '',
                authenticating: true,
                redirectToReferrer: false,
                errors: { ...this.state.errors },
            });

            auth.manager.signinRedirect();

            // const args = {
            //     username: this.fields.username.value,
            //     password: this.fields.password.value,
            // };

            // const registering = this.state.registering;
            // if (registering) {
            //     args.email = this.fields.email.value;
            // }

            // const func = registering ? signup : signin;
            // func(args)
            //     .then(({ success, errors }) => {
            //         if (!success) {
            //             this.processErrors(errors);
            //             return;
            //         }
            //         if (registering) {
            //             this.setState({ registered: true });
            //             return;
            //         }

            //         log.debug('Create and establish a WebSocket connection');

            //         const token = store.get('session.token');
            //         auth.host = '';
            //         auth.options = {
            //             query: 'token=' + token
            //         };
            //     })
            //     .then(Workspaces.connect)
            //     .then(() => {
            //         this.setState({
            //             alertMessage: '',
            //             authenticating: false,
            //             redirectToReferrer: true,
            //             errors: this.emptyErrors,
            //         });
            //     })
            //     .catch((e) => {
            //         console.log('signup/signin error', e);
            //     });
        }
    };

    fields = {
        email: null,
        username: null,
        password: null,
        passwordMatch: null,
    };

    getDefaultState() {
        return {
            alertMessage: '',
            username: '',
            registering: false,
            resending: false,
            authenticating: false,
            redirectToReferrer: false,
            registered: false,
            errors: this.emptyErrors,
        };
    }

    onChangeEmail() {
        if (!this.state.registering || this.state.hasChangedUsername) {
            return;
        }
        this.fields.username.value = this.fields.email.value.split('@')[0];
    }

    onChangePasswords(v1) {
        if (!this.state.registering || v1.length <= 0) {
            this.setState({ password: v1 });
            return;
        }
        const v2 = this.fields.passwordMatch.value || '';
        const errs = [];
        if (v1 !== v2) {
            errs.push('Passwords do not match.');
        }
        this.setState({
            ...this.state,
            errors: {
                ...this.state.errors,
                passwordMatch: errs,
            }
        });
    }

    get emptyErrors() {
        return {
            email: [],
            username: [],
            password: [],
            passwordMatch: [],
            unknown: [],
        };
    }

    renderError(kind) {
        const msgs = this.state.errors[kind];
        return !msgs ? '' : (
            <ul className={styles.error}>{msgs.map((msg) => {
                return <li key={msg}>{msg}</li>;
            })}
            </ul>
        );
    }

    renderSocialLogin(name) {
        const authenticating = this.state.authenticating;
        const icon = 'fa-' + name.toLowerCase();
        return (
            <button
                type="button"
                className="btn btn-block btn-secondary"
                style={{ marginLeft: '0' }}
                onClick={(e) => {
                    window.location.replace(`https://openwork.shop/api/auth/${name}`);
                }}
                disabled={authenticating}
            >
                <i
                    className={cx(
                        'fa',
                        'fa-fw',
                        icon
                    )}
                />
                <Space width="8" />
                {name}
            </button>
        );
    }

    renderSocialLogins() {
        return (
            <div>
                <i>Or, use one of the following...</i>
                <br />
                {this.renderSocialLogin('GitHub')}
                {this.renderSocialLogin('Google')}
            </div>
        );
    }

    render() {
        const error = decodeURIComponent(window.location.hash.split('error=')[1] || '');

        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const state = { ...this.state };
        // const actions = { ...this.actions };
        const { alertMessage, authenticating, registering } = state;
        const docLink = 'http://www.makerverse.com/features/security/';
        let enabled = !authenticating && this.fields.username && this.fields.username.value.length > 0 &&
            this.fields.password && this.fields.password.value.length > 0;
        if (enabled && registering) {
            enabled = state.errors.passwordMatch.length === 0;
        }

        if (state.redirectToReferrer) {
            const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
            if (query && query.continue) {
                log.debug(`Navigate to "${query.continue}"`);

                window.location = query.continue;

                return null;
            }

            log.debug(`Redirect from "/login" to "${from.pathname}"`);
            return (
                <Redirect to={from} />
            );
        }

        return (
            <div className={styles.container}>
                <div className={styles.login}>
                    <div className={styles.title}>
                        <img src="images/logo-badge-32x32.png" alt="" style={{ maxWidth: '32px', marginRight: '10px' }} />
                        {i18n._('Login')}
                    </div>
                    <div className={styles.content}>
                        {error.length > 0 && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}
                        <form className={styles.form}>
                            <div className="form-group">
                                {this.renderError('unknown')}
                                <button
                                    type="submit"
                                    className="btn btn-block btn-primary"
                                    onClick={this.actions.handleSignIn}
                                    disabled={authenticating}
                                >
                                    <i
                                        className={cx(
                                            'fa',
                                            'fa-fw',
                                            { 'fa-spin': authenticating },
                                            { 'fa-circle-o-notch': authenticating },
                                            { 'fa-user': !authenticating },
                                        )}
                                    />
                                    <Space width="8" />
                                    {i18n._('Login')}
                                </button>
                                <center>
                                    <i>
                                        - or -
                                    </i>
                                </center>
                                <button
                                    type="submit"
                                    className="btn btn-block btn-primary"
                                    onClick={this.actions.handleSignIn}
                                    disabled={authenticating}
                                >
                                    <i
                                        className={cx(
                                            'fa',
                                            'fa-fw',
                                            { 'fa-spin': authenticating },
                                            { 'fa-circle-o-notch': authenticating },
                                            { 'fa-user-plus': !authenticating },
                                        )}
                                    />
                                    <Space width="8" />
                                    {i18n._('Create an Account')}
                                </button>
                                {alertMessage && (
                                    <div className={styles.error}>
                                        {alertMessage}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className={styles.footer}>
                        <Anchor href={docLink}>
                            {i18n._('Why is it necessary to log in?')}
                        </Anchor>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
