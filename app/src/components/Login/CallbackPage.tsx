import {Typography } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {AlertList} from '@openworkshop/ui/components/Alerts';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import { User } from 'oidc-client';
import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { CallbackComponent } from 'redux-oidc';
import analytics from '../../lib/analytics';
import ReconnectRedirect from '../Navigation/ReconnectRedirect';
import useStyles from './Styles';
import {useMakerverse, useMakerverseTrans} from '../../providers';

type Props = {

};

const CallbackPage: FunctionComponent<Props> = () => {
  const makerverse = useMakerverse();
  const t = useMakerverseTrans();
  const log = useLogger(CallbackPage);
  const classes = useStyles();
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [token, setToken] = React.useState<string | undefined>(undefined);

  function handleSuccess(oidc: User) {
    log.debug('success', oidc);
    setError(undefined);
    analytics.event({
      category: 'interaction',
      action: 'logged-in',
    });
    setToken(oidc.access_token);
  }

  function handleError(err: Error) {
    log.debug(err);
    setError(err);
    analytics.event({
      category: 'interaction',
      action: 'login-error',
      label: `${err.name}: ${err.message}`,
    });
  }

  const footer = error ? <Typography className={classes.centered} variant="subtitle1">
    <Link to="/login">
      {t('Return to Login')}
    </Link>
  </Typography> : undefined;

  function renderBody() {
    if (error) {
      return <AlertList error={error} />;
    }
    if (token) {
      return (
        // After login, the session needs to be recreated to change the user.
        <ReconnectRedirect to="/" />
      );
    }
    return (
      <CallbackComponent
        userManager={makerverse.ows.authManager}
        successCallback={handleSuccess}
        errorCallback={handleError}
      >
        <Typography variant="subtitle1" className={classes.centered}>
          {t('Exchanging keys with gatekeeper...')}
        </Typography>
      </CallbackComponent>
    );
  }

  return (
    <ThreeColumns>
      <ToolbarCard
        title={t('Authentication')}
        footer={footer}
      >
        {renderBody()}
      </ToolbarCard>
    </ThreeColumns>
  );
};

export default CallbackPage;
