import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { OpenWorkShop } from '@openworkshop/lib';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import React, { FunctionComponent } from 'react';
// import auth from '../../lib/auth';
import {IMakerverseUser} from '../../lib/Makerverse';
import useStyles from './Styles';
import analytics from 'lib/analytics';
import settings from 'config/settings';
import docs from 'constants/docs';
import { useTranslation } from 'react-i18next';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const LoginPage: FunctionComponent<Props> = (props) => {
  const log = useLogger(LoginPage);
  const ows = React.useContext(OpenWorkShop);
  const classes = useStyles();
  const { t } = useTranslation();
  const [guest, setGuest] = React.useState<IMakerverseUser | undefined>(undefined);
  const [useCookies, setUseCookies] = React.useState<boolean>(false);
  const [dangerous, setDangerous] = React.useState<boolean>(false);
  const [authenticating, setAuthenticating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<Error | undefined>(undefined);
  //
  // if (auth.isAuthenticated()) {
  //   log.debug('Already logged in; redirecting.');
  //   // return <Redirect to='/home' />;
  // }

  if (error) log.error(error);

  function handleGuest() {
    log.debug('guest login');
  }

  function handleLogin(register: boolean) {
    log.debug('begin authentication');
    analytics.event({
      category: 'interaction',
      action: register ? 'register' : 'login',
    });
    setAuthenticating(true);
    setError(undefined);

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
    <Grid container direction='column' alignItems='center' >
      <Grid item xs={12} sm={6} md={4}>
        <Card className={classes.root}>
          <CardHeader className={classes.cardHeader} title={<Toolbar>
            {t('Login to {{ productName }}', settings)}
          </Toolbar>} />
          <AlertList error={error} />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3} className={classes.centered}>
                <img src='/images/logo.png' alt='' style={{ maxWidth: '64px', marginRight: '10px' }} />
              </Grid>
              <Grid item xs={12} sm={9} className={classes.centered}>
                <Button
                  variant='contained'
                  color='primary'
                  disabled={authenticating}
                  onClick={() => handleLogin(false)}>
                  {!authenticating && (
                    <span>
                      {t('Login')}
                      <br />
                      {t('(or Create Account)')}
                    </span>
                  )}
                  {authenticating && <CircularProgress />}
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
      </Grid>
    </Grid>
  );
};

export default LoginPage;
