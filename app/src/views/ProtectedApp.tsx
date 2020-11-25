import { Typography } from '@material-ui/core';
import {OpenWorkShop} from '@openworkshop/lib';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {Preloader} from '@openworkshop/ui/components';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import { User } from 'oidc-client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {Link, Redirect } from 'react-router-dom';
import {
  MakerverseEssentialSettingsFragment,
  MakerverseSessionFragment,
  useStartupQuery,
} from '../api/graphql';
import {AppState} from '../store/redux';
import App from './App';

interface IProps {
  token: string;
  currentWorkspaceId?: string;
  onLoaded: (u: MakerverseSessionFragment, s: MakerverseEssentialSettingsFragment) => void;
}

const ProtectedApp: React.FunctionComponent<IProps> = (props) => {
  const log = useLogger(ProtectedApp);
  const { t } = useTranslation();
  const { onLoaded, currentWorkspaceId, token } = props;
  const [ dataError, setDataError ] = React.useState<Error | undefined>(undefined);
  const { loading, data, error } = useStartupQuery({ variables: { token: token ?? '' }});

  React.useEffect(() => {
    if (!loading && !error) {
      if (!data) {
        log.warn('no data in token response');
        setDataError(new Error('No data in response.'));
      } else {
        log.debug('valid token response');
        onLoaded(data.session, data.settings);
      }
    }
  }, [loading, data, error]);

  if (loading) {
    log.debug('validating token...');
    return <Preloader />;
  }

  if (error || dataError) {
    log.warn('failed to start', loading, error, data);
    const footer = <Typography variant="subtitle1"><Link to="/login">{t('Return to Login')}</Link></Typography>;
    return (
      <ThreeColumns >
        <ToolbarCard title={t('Startup Error')} footer={footer}>
          <AlertList errors={[error, dataError]} />
        </ToolbarCard>
      </ThreeColumns>
    );
  }

  return <App currentWorkspaceId={currentWorkspaceId} />;
};

export default ProtectedApp;
