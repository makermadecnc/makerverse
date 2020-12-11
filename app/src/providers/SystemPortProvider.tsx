import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import {IPortCollection, SystemPortContext} from './SystemPortContext';
import {
  PortStatusFragment,
  useListPortsQuery,
  usePortChangeSubscription
} from '../api/graphql';
import {AlertDialog} from '@openworkshop/ui/components/Alerts';
import {useMakerverseTrans} from 'providers';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const SystemPortProvider: FunctionComponent<Props> = (props) => {
  const log = useLogger(SystemPortProvider);
  const t = useMakerverseTrans();

  // The initial state of all ports, a simple query.
  const queryPorts = useListPortsQuery();

  // For a given port: Connected/Disconnected, Activity state
  const onPortStatusChange = usePortChangeSubscription();
  const updatedPort = onPortStatusChange.data ? onPortStatusChange.data.port : undefined;

  // const portList = query.data && data.ports ? data.ports : [];
  const [portList, setPortList] = React.useState<PortStatusFragment[]>([]);
  const portNames = portList.map(p => p.portName);
  const sortedPortNames = portNames.sort();
  const hasPorts = portNames.length > 0;

  const errors = [queryPorts.error, onPortStatusChange.error];

  log.verbose('query', queryPorts, 'status', onPortStatusChange);

  // Load the initial queryPorts into the state.
  React.useEffect(() => {
    if (!hasPorts && queryPorts.data && queryPorts.data.ports) {
      log.debug('[PORT LIST]', 'initial query', queryPorts.data.ports);
      setPortList(queryPorts.data.ports);
    }
  }, [hasPorts, queryPorts]);

  // Update the current state of a port
  React.useEffect(() => {
    if (updatedPort) {
      log.debug('[PORT LIST]', 'updated port', updatedPort);
      const idx = _.findIndex(portList, p => p.portName === updatedPort.portName);
      const ports = [...portList];
      if (idx === undefined || idx < 0) {
        ports.push(updatedPort);
      } else {
        ports[idx] = updatedPort;
      }
      setPortList(ports);
    }
  }, [updatedPort]);

  const portMap = _.keyBy(portList, p => p.portName);
  const portCollection: IPortCollection = { errors, sortedPortNames, portMap };

  return (
    <SystemPortContext.Provider value={portCollection} >
      <AlertDialog title={t('Port Connection Error')} errors={errors} />
      {props.children}
    </SystemPortContext.Provider>
  );
};

export default SystemPortProvider;
