import * as React from 'react';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {ConnectionState} from '../../lib/Makerverse/apollo';
import {useBackendConnectionState, useMakerverseTrans} from '../../providers';
import CardDialog from '@openworkshop/ui/components/Cards/CardDialog';
import { CircularProgress, Typography } from '@material-ui/core';

const BackendDiconnectedModal: React.FunctionComponent = () => {
  const log = useLogger(BackendDiconnectedModal);
  const t = useMakerverseTrans();
  const connectionState: ConnectionState = useBackendConnectionState();
  const [timedOut, setTimedOut] = React.useState(false);
  const isConnected = connectionState === ConnectionState.Connected;

  React.useEffect(() => {
    log.debug('connected?', connectionState);
    if (!isConnected) {
      if (timedOut) {
        setTimedOut(false);
        window.location.reload();
        return;
      }
      setTimeout(() => {
        setTimedOut(true);
      }, 30000);
    } else {
      setTimedOut(false);
    }
  }, [connectionState, isConnected, timedOut]);

  return (
    <CardDialog
      open={!isConnected} title={t('Disconnected')} onClose={() => log.warn('close forbidden')}
    >
      <div style={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6">{t('Trying to Reconnect...')}</Typography>
      </div>
    </CardDialog>
  );
};

export default BackendDiconnectedModal;
