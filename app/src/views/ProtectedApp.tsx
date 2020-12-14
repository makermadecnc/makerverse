import { Typography } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {Preloader} from '@openworkshop/ui/components';
import React from 'react';
import {Link } from 'react-router-dom';
import {
  StartupFragment,
  OpenControllerSessionFragment,
  useStartupQuery,
} from '@openworkshop/lib/api/graphql';
import App from './App';
import {AlertDialog} from '@openworkshop/ui/components/Alerts';
import {useTrans} from '@openworkshop/ui/open-controller/Context';

interface IProps {
  token: string;
  currentWorkspaceId?: string;
  onLoaded: (u: OpenControllerSessionFragment, s: StartupFragment) => void;
}

const ProtectedApp: React.FunctionComponent<IProps> = (props) => {
  const log = useLogger(ProtectedApp);
  const t = useTrans();
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
        onLoaded(data.session, data);
      }
    }
  }, [loading, data, error]);

  if (loading) {
    log.debug('[TOKEN]', 'validating', data, error);
    return <Preloader />;
  }

  if (error || dataError) {
    log.warn('failed to start', loading, error, data);
    return (
      <AlertDialog title={t('Startup Error')} permanent={true} errors={[error, dataError]}>
        <Typography variant="subtitle1"><Link to="/login">{t('Return to Login')}</Link></Typography>
      </AlertDialog>
    );
  }

  log.verbose('[TOKEN]', 'validated', data);
  return <App currentWorkspaceId={currentWorkspaceId} />;
};

export default ProtectedApp;
