import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import _ from 'lodash';
import React, { FunctionComponent } from 'react';
import {IPortCollection, PortMap, SystemPortContext} from './SystemPortContext';
import {
  PortStatusFragment,
  useListPortsQuery,
  usePortListSubscription,
  usePortStatusSubscription
} from '../api/graphql';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const SystemPortProvider: FunctionComponent<Props> = (props) => {
  const log = useLogger(SystemPortProvider);

  // The initial state of all ports, a simple query.
  const queryPorts = useListPortsQuery();

  // When a port is added/removed from the machine.
  const onPortListChange = usePortListSubscription();

  // For a given port: Connected/Disconnected, Activity state
  const onPortStatusChange = usePortStatusSubscription();
  const updatedPort = onPortStatusChange.data ? onPortStatusChange.data.port : undefined;

  // const portList = query.data && data.ports ? data.ports : [];
  const [portList, setPortList] = React.useState<PortStatusFragment[]>([]);
  const portNames = portList.map(p => p.portName);
  const sortedPortNames = portNames.sort();
  const hasPorts = portNames.length > 0;

  const errors = [queryPorts.error, onPortListChange.error, onPortStatusChange.error];

  log.verbose('query', queryPorts, 'list', onPortListChange, 'status', onPortStatusChange);

  // Load the initial queryPorts into the state.
  React.useEffect(() => {
    if (!hasPorts && queryPorts.data && queryPorts.data.ports) {
      log.debug('[PORT LIST]', 'initial query', queryPorts.data.ports);
      setPortList(queryPorts.data.ports);
    }
  }, [hasPorts, queryPorts]);

  // Add/Remove ports from the port list
  React.useEffect(() => {
    if (onPortListChange.data && onPortListChange.data.ports) {
      log.debug('[PORT LIST]', 'change', onPortListChange.data.ports);
      setPortList(onPortListChange.data.ports);
    }
  }, [onPortListChange]);

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
      <AlertList errors={errors} />
      {props.children}
    </SystemPortContext.Provider>
  );
};

export default SystemPortProvider;
