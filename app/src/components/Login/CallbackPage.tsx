import {Typography } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {AlertList} from '@openworkshop/ui/components/Alerts';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import { User } from 'oidc-client';
import React, { FunctionComponent } from 'react';
import {Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CallbackComponent } from 'redux-oidc';
import analytics from '../../lib/analytics';
import {MakerverseContext} from '../../lib/Makerverse';
import ReconnectRedirect from '../Navigation/ReconnectRedirect';
import useStyles from './Styles';

type Props = {

};

const CallbackPage: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const log = useLogger(CallbackPage);
  const classes = useStyles();
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const [token, setToken] = React.useState<string | undefined>(undefined);
  const makerverse = React.useContext(MakerverseContext);

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
      <Trans>Return to Login</Trans>
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
          <Trans>Exchanging keys with gatekeeper...</Trans>
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
