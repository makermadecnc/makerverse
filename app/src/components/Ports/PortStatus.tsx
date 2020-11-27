import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import {PortStatusFragment, usePortStatusSubscription} from '../../api/graphql';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsb } from '@fortawesome/free-brands-svg-icons';

interface OwnProps {
  port?: PortStatusFragment;
}

type Props = OwnProps;

const PortStatus: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const log = useLogger(PortStatus);
  const [ port, setPort ] = React.useState(props.port);
  const portName = port ? port.portName : undefined;

  // Monitor the ports, so as to show the connection status of workspaces.
  const { data, loading, error } = usePortStatusSubscription();

  React.useEffect(() => {
    if (data && data.port.portName == portName) {
      log.debug('subscription update', port);
      setPort(data.port);
    }
  }, [data, port, setPort]);

  function getPortStatusText() {
    if (!port) return t('Unplugged');
    if (!port.connection) return t('Ready');
    if (port.connection.status.bytesToRead > 0) return t('Reading');
    if (port.connection.status.bytesToWrite > 0) return t('Writing');
    return t('Open');
  }

  if (error) {
    return <React.Fragment >Error: {error.name}</React.Fragment>;
  }

  return (
    <React.Fragment >
      <FontAwesomeIcon icon={ faUsb } />
      {' '}{getPortStatusText()}
    </React.Fragment>
  );
};

export default PortStatus;
