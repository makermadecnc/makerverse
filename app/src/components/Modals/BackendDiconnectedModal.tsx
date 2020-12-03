import * as React from 'react';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {ConnectionState} from '../../lib/Makerverse/apollo';
import {useBackendConnectionState} from '../../providers';
import CardDialog from '@openworkshop/ui/components/Cards/CardDialog';
import { CircularProgress, Typography } from '@material-ui/core';
import { Trans, useTranslation } from 'react-i18next';

type Props = {

};

const BackendDiconnectedModal: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(BackendDiconnectedModal);
  const { t } = useTranslation();
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
        <Typography variant="h6"><Trans>Trying to Reconnect...</Trans></Typography>
      </div>
    </CardDialog>
  );
};

export default BackendDiconnectedModal;
