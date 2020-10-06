import cx from 'classnames';
import qs from 'qs';
import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import Anchor from 'app/components/Anchor';
import Space from 'app/components/Space';
// import settings from 'app/config/settings';
import Workspaces from 'app/lib/workspaces';
// import promisify from 'app/lib/promisify';
import auth from 'app/lib/auth';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import { signup, signin, resend } from 'app/lib/user';
import store from 'app/store';
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
        handleResendVerification: (event) => {
            event.preventDefault();
            this.setState({ resending: true });
            resend({ username: this.state.username })
                .then(({ success, errors }) => {
                    if (!success) {
                        this.processErrors(errors);
                        return;
                    }
                    this.setState({
                        resent: true,
                        resending: false,
                    });
                });
        },
        handleForgotPassword: (event) => {
            event.preventDefault();
        },
        handleSignIn: (event) => {
            event.preventDefault();

            this.setState({
                alertMessage: '',
                authenticating: true,
                redirectToReferrer: false,
                errors: { ...this.state.errors },
            });

            const args = {
                username: this.fields.username.value,
                password: this.fields.password.value,
            };

            const registering = this.state.registering;
            if (registering) {
                args.email = this.fields.email.value;
            }

            const func = registering ? signup : signin;
            func(args)
                .then(({ success, errors }) => {
                    if (!success) {
                        this.processErrors(errors);
                        return;
                    }
                    if (registering) {
                        this.setState({ registered: true });
                        return;
                    }

                    log.debug('Create and establish a WebSocket connection');

                    const token = store.get('session.token');
                    auth.host = '';
                    auth.options = {
                        query: 'token=' + token
                    };
                })
                .then(Workspaces.connect)
                .then(() => {
                    this.setState({
                        alertMessage: '',
                        authenticating: false,
                        redirectToReferrer: true,
                        errors: this.emptyErrors,
                    });
                })
                .catch((e) => {
                    console.log('signup/signin error', e);
                });
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

    renderResend() {
        if (this.state.resent) {
            return <i>The email has been re-sent.</i>;
        }
        const enabled = !this.state.resending;
        return (
            <button
                type="submit"
                className="btn btn-block btn-primary"
                onClick={this.actions.handleResendVerification}
                disabled={!enabled}
            >
                <i
                    className={cx(
                        'fa',
                        'fa-fw',
                        { 'fa-envelope-o': enabled },
                        { 'fa-spin': !enabled },
                    )}
                />
                <Space width="8" />
                {i18n._('Resend Verification Email')}
            </button>
        );
    }

    render() {
        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const state = { ...this.state };
        // const actions = { ...this.actions };
        const { alertMessage, authenticating, registering, registered } = state;
        const act = registering ? i18n._('Create Account') : i18n._('Sign in');
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

        if (registered) {
            return (
                <div className={styles.container}>
                    <div className={styles.login}>
                        <div className={styles.title}>
                            Confirm your Email Address
                        </div>
                        <div className={styles.content}>
                            {'Please check your inbox for an email from:'}
                            <br />
                            <b>hello@openwork.shop</b>
                            <br />
                            <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                {this.renderResend()}
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <a
                                href={docLink}
                                onClick={(e) => {
                                    e.preventDefault();
                                    this.setState({ registered: false });
                                }}
                            >
                                {i18n._('Return to Login')}
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={styles.container}>
                <div className={styles.login}>
                    <div className={styles.title}>
                        <img src="images/logo-badge-32x32.png" alt="" style={{ maxWidth: '32px', marginRight: '10px' }} />
                        {act}
                    </div>
                    <div className={styles.content}>
                        <div style={{ textAlign: 'center', textDecoration: 'italic', marginBottom: '10px' }}>
                            {registering && (
                                <a
                                    href="#sign-in"
                                    onClick={(e) => {
                                        this.setState({ registering: false });
                                        e.preventDefault();
                                    }}
                                >
                                    {i18n._('Already have an account?')}
                                </a>
                            )}
                            {!registering && (
                                <a
                                    href="#sign-up"
                                    onClick={(e) => {
                                        this.setState({ registering: true });
                                        e.preventDefault();
                                    }}
                                >
                                    {i18n._('Don\'t have an account?')}
                                </a>
                            )}
                        </div>
                        <form className={styles.form}>
                            {registering && (
                                <div className="form-group">
                                    <input
                                        ref={node => {
                                            this.fields.email = node;
                                        }}
                                        type="email"
                                        onChange={() => this.onChangeEmail()}
                                        className="form-control"
                                        placeholder={i18n._('Email')}
                                        autoComplete="email"
                                    />
                                    {this.renderError('email')}
                                </div>
                            )}
                            <div className="form-group">
                                <input
                                    ref={node => {
                                        this.fields.username = node;
                                    }}
                                    type="text"
                                    onChange={(e) => this.setState({
                                        hasChangedUsername: true,
                                        username: e.target.value,
                                    })}
                                    className="form-control"
                                    placeholder={i18n._('Username')}
                                    autoComplete="username"
                                />
                                {this.renderError('username')}
                            </div>
                            <div className="form-group">
                                <input
                                    ref={node => {
                                        this.fields.password = node;
                                    }}
                                    type="password"
                                    onChange={(e) => this.onChangePasswords(e.target.value)}
                                    className="form-control"
                                    placeholder={i18n._('Password')}
                                    autoComplete="password"
                                />
                                {this.renderError('password')}
                            </div>
                            {registering && (
                                <div className="form-group">
                                    <input
                                        ref={node => {
                                            this.fields.passwordMatch = node;
                                        }}
                                        type="password"
                                        className="form-control"
                                        onChange={() => this.onChangePasswords()}
                                        placeholder={i18n._('Password (again)')}
                                        autoComplete="password"
                                    />
                                    {this.renderError('passwordMatch')}
                                </div>
                            )}
                            {!registering && (
                                <div style={{ textAlign: 'right', width: '100%' }}>
                                    <a href="#forgot-password" onClick={this.actions.handleForgotPassword}>
                                        {i18n._('Forgot your password?')}
                                    </a>
                                </div>
                            )}
                            <div className="form-group">
                                {this.renderError('unknown')}
                                <button
                                    type="submit"
                                    className="btn btn-block btn-primary"
                                    onClick={this.actions.handleSignIn}
                                    disabled={!enabled}
                                >
                                    <i
                                        className={cx(
                                            'fa',
                                            'fa-fw',
                                            { 'fa-spin': authenticating },
                                            { 'fa-circle-o-notch': authenticating },
                                            { 'fa-sign-in': !authenticating && !registering },
                                            { 'fa-user-plus': !authenticating && registering },
                                        )}
                                    />
                                    <Space width="8" />
                                    {act}
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
                            {i18n._('Why is it necessary to create an account?')}
                        </Anchor>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);
