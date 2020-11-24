import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { OpenWorkShop } from '@openworkshop/lib';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import CardFooter from '@openworkshop/ui/components/Cards/CardFooter';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import React, { FunctionComponent } from 'react';
import {MakerverseUser} from '../../api/graphql';
import useStyles from './Styles';
import analytics from 'lib/analytics';
import settings from 'config/settings';
import docs from 'constants/docs';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const LoginPage: FunctionComponent<Props> = (props) => {
  const log = useLogger(LoginPage);
  const ows = React.useContext(OpenWorkShop);
  const classes = useStyles();
  const { t } = useTranslation();
  const [guest, setGuest] = React.useState<MakerverseUser | undefined>(undefined);
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

  const footer = <Typography variant="subtitle2">
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
  </Typography>;

  return (
    <ThreeColumns>
      <ToolbarCard
        title={t('Login to {{ productName }}', settings)}
        footer={footer}
      >
        <AlertList error={error} />
        <div className={classes.centered}>
          <Button
            className={classes.actionButton}
            variant='outlined'
            color='primary'
            disabled={authenticating}
            onClick={() => handleLogin(false)}
          >
            <img src='/images/logos/makerverse.png' alt='Logo' className={classes.logo1} />
            {!authenticating && (
              <span>
                {t('Login')}
                <br />
                {t('(or Create Account)')}
              </span>
            )}
            {authenticating && <CircularProgress />}
            <img src='/images/logos/openworkshop.png' alt='Logo' className={classes.logo2} />
          </Button>
        </div>
      </ToolbarCard>
      <div className={classes.bottom}>
        <Typography variant='subtitle2'>v. {settings.version.full}</Typography>
      </div>
    </ThreeColumns>
  );
};

export default LoginPage;
