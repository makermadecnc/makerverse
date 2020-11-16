import cx from 'classnames';
import qs from 'qs';
import log from 'js-logger';
import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { Space } from 'components/';
import i18n from 'lib/i18n';
import { setCookie, deleteCookie } from 'lib/cookies';
import auth from 'lib/auth';
import settings from 'config/settings';
import analytics from 'lib/analytics';
import styles from './index.styl';

class Login extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes,
    };

    state = this.getDefaultState();

    actions = {
        handleSignIn: (event, register) => {
            event.preventDefault();

            this.setState({
                alertMessage: '',
                authenticating: true,
                redirectToReferrer: false,
                errors: { ...this.state.errors },
            });
            analytics.event({
                category: 'interaction',
                action: register ? 'register' : 'login',
            });

            this.props.owsCore.authManager.createSigninRequest().then(r => {
                const url = register ? r.url.replace('/login?', '/register?') : r.url;
                window.location.replace(url);
            }).catch((e) => {
                this.setState({
                    alertMessage: `${e.message}`,
                    authenticating: false,
                });
            });
        },
        handleGuest: (event) => {
            event.preventDefault();

            if (this.state.useCookies) {
                setCookie(auth.GUEST_COOKIE_NAME, '1');
            } else {
                deleteCookie(auth.GUEST_COOKIE_NAME);
            }

            this.setState({
                alertMessage: '',
                authenticating: true,
                redirectToReferrer: false,
            });

            auth.signin(null, true)
                .then((r) => {
                    this.setState({
                        redirectToReferrer: true,
                        authenticating: false
                    });
                })
                .catch((e) => {
                    this.setState({
                        alertMessage: e.message,
                        authenticating: false
                    });
                });
        },
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
            guest: null,
            useCookies: false,
            errors: this.emptyErrors,
            redirect: null,
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

    componentDidMount() {
        auth.guest().then((gm) => this.setState({ guest: !!gm }));
    }

    render() {
        const error = decodeURIComponent(window.location.hash.split('error=')[1] || '');

        const { from } = this.props.location.state || { from: { pathname: '/' } };
        const state = { ...this.state };
        // const actions = { ...this.actions };
        const { alertMessage, authenticating, registering, guest, dangerous, useCookies } = state;
        const docLink = 'http://www.makerverse.com/features/security/';
        const showLogout = error && error.includes('Wrong user');
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
            // <center>
            //     <i>
            //         - or -
            //     </i>
            // </center>
            // <button
            //     type="submit"
            //     className="btn btn-block btn-primary"
            //     onClick={(e) => this.actions.handleSignIn(e, true)}
            //     disabled={authenticating}
            // >
            //     <i
            //         className={cx(
            //             'fa',
            //             'fa-fw',
            //             { 'fa-spin': authenticating },
            //             { 'fa-circle-o-notch': authenticating },
            //             { 'fa-user-plus': !authenticating },
            //         )}
            //     />
            //     <Space width="8" />
            //     {i18n._('Create an Account')}
            // </button>
        }

        return (
            <div className={styles.container}>
                <div className={styles.login}>
                    <div className={styles.title}>
                        <img src="images/logo-badge-32x32.png" alt="" style={{ maxWidth: '32px', marginRight: '10px' }} />
                        {settings.productName}
                    </div>
                    <div className={styles.content}>
                        {error.length > 0 && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}
                        {showLogout && (
                            <button
                                type="submit"
                                className="btn btn-block btn-primary"
                                onClick={(e) => auth.signout(this.props.owsCore)}
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
                                {i18n._('Logout')}
                            </button>
                        )}
                        <form className={styles.form}>
                            <div className="form-group">
                                {this.renderError('unknown')}

                                <button
                                    type="submit"
                                    className="btn btn-block btn-primary"
                                    onClick={(e) => this.actions.handleSignIn(e, false)}
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
                                    {i18n._('Login (or Register)')}
                                </button>
                                {alertMessage && (
                                    <div className={styles.error}>
                                        <center>
                                            {alertMessage}
                                        </center>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className={styles.footer}>
                        {!guest && (
                            <analytics.OutboundLink
                                eventLabel="why_login"
                                to={docLink}
                                target="_blank"
                            >
                                {i18n._('Why is it necessary to log in?')}
                            </analytics.OutboundLink>
                        )}
                        {guest && (
                            <div>
                                <div className="checkbox">
                                    <label>
                                        <input
                                            type="checkbox"
                                            defaultChecked={useCookies}
                                            onChange={() => this.setState({ useCookies: !useCookies })}
                                        />
                                        {i18n._('Remember me (I consent to cookies)')}
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            defaultChecked={dangerous}
                                            onChange={() => this.setState({ dangerous: !dangerous })}
                                        />
                                        {i18n._('I understand "guest mode" is hazardous. ')}
                                    </label>
                                </div>
                                <br />
                                <button
                                    className="btn btn-block btn-secondary"
                                    onClick={(e) => this.actions.handleGuest(e)}
                                    disabled={authenticating || !dangerous}
                                >
                                    {i18n._('Continue as Guest')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <br />
                <center>
                    <i>v. {settings.version.full}</i>
                </center>
            </div>
        );
    }
}

export default withRouter(Login);
