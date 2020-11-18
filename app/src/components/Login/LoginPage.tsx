import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
} from '@material-ui/core';
import OpenWorkShopContext from '@openworkshop/lib/OpenWorkShopContext';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { FullCentered } from '@openworkshop/ui/components';
import React, { FunctionComponent } from 'react';
import auth from '../../lib/auth';
import useStyles from './Styles';
import analytics from 'lib/analytics';
import settings from 'config/settings';
import docs from 'constants/docs';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

interface IUser {
  username: string;
}

const LoginPage: FunctionComponent<Props> = (props) => {
  const log = useLogger(LoginPage);
  const ows = React.useContext(OpenWorkShopContext);
  const classes = useStyles();
  const { t } = useTranslation();
  const [guest, setGuest] = React.useState<IUser | undefined>(undefined);
  const [useCookies, setUseCookies] = React.useState<boolean>(false);
  const [dangerous, setDangerous] = React.useState<boolean>(false);
  const [authenticating, setAuthenticating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);

  if (auth.isAuthenticated()) {
    log.debug('Already logged in; redirecting.');
    return <Redirect to='/home' />;
  }

  function handleGuest() {
    log.debug('guest login');
  }

  function handleLogin(register: boolean) {
    log.debug('begin authentication');
    analytics.event({
      category: 'interaction',
      action: register ? 'register' : 'login',
    });

    ows.authManager
      .createSigninRequest()
      .then((r) => {
        const url = register ? r.url.replace('/login?', '/register?') : r.url;
        window.location.replace(url);
      })
      .catch((e) => {
        setAuthenticating(false);
        setError(e);
      });
  }

  return (
    <FullCentered>
      <Card>
        <CardHeader className={classes.cardHeader} title={t('Login to {{ productName }}', settings)} />
        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={3}>
              <img src='/images/logo.png' alt='' style={{ maxWidth: '64px', marginRight: '10px' }} />
            </Grid>
            <Grid item xs={12} sm={9} className={classes.centered}>
              <Button variant='contained' color='primary' onClick={() => handleGuest()}>
                {t('Authenticate (or Create Account)')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={classes.cardFooter}>
          {!guest && (
            <analytics.OutboundLink eventLabel='why_login' to={docs.urlSecurity} target='_blank'>
              {t('Why is it necessary to log in?')}
            </analytics.OutboundLink>
          )}
          {guest && (
            <div>
              <FormControlLabel
                control={<Checkbox checked={useCookies} onChange={() => setUseCookies(!useCookies)} />}
                label={t('Remember me (I consent to cookies)')}
              />
              <FormControlLabel
                control={<Checkbox checked={dangerous} onChange={() => setDangerous(!dangerous)} />}
                label={t('I understand "guest mode" is hazardous. ')}
              />
              <br />
              <Button onClick={() => handleGuest()} disabled={authenticating || !dangerous}>
                {t('Continue as Guest')}
              </Button>
            </div>
          )}
        </CardActions>
      </Card>
      <div className={classes.bottom}>
        <Typography variant='subtitle2'>v. {settings.version.full}</Typography>
      </div>
    </FullCentered>
  );
};

export default LoginPage;
