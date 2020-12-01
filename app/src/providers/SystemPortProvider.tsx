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
  const [portMap, setPortMap] = React.useState<PortMap>({});
  const portNames = Object.keys(portMap);
  const sortedPortNames = portNames.sort();
  const hasPorts = portNames.length > 0;

  const errors = [queryPorts.error, onPortListChange.error, onPortStatusChange.error];
  log.trace('query', queryPorts, 'list', onPortListChange, 'status', onPortStatusChange);

  function replacePortMap(ports: PortStatusFragment[]) {
    const map = _.keyBy<PortStatusFragment>(ports, p => p.portName);
    setPortMap(map);
  }

  // Load the initial queryPorts into the state.
  React.useEffect(() => {
    if (!hasPorts && queryPorts.data && queryPorts.data.ports) {
      replacePortMap(queryPorts.data.ports);
    }
  }, [hasPorts, queryPorts]);

  // Add/Remove ports from the port list
  React.useEffect(() => {
    if (onPortListChange.data && onPortListChange.data.ports) {
      replacePortMap(onPortListChange.data.ports);
    }
  }, [onPortListChange]);

  // Update the current state of a port
  React.useEffect(() => {
    if (updatedPort) {
      const pmUpdate = { ...portMap };
      pmUpdate[updatedPort.portName] = updatedPort;
      setPortMap(pmUpdate);
    }
  }, [updatedPort]);

  const portCollection: IPortCollection = { errors, sortedPortNames, portMap };

  return (
    <SystemPortContext.Provider value={portCollection} >
      <AlertList errors={errors} />
      {props.children}
    </SystemPortContext.Provider>
  );
};

export default SystemPortProvider;
