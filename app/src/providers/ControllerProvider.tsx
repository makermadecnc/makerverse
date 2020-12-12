import * as React from 'react';
import {
  useMachineConfigurationSubscription,
  useMachineSettingsSubscription,
  useMachineStateSubscription
} from '../api/graphql';
import {ControlledMachineFragment} from '../api/graphql';
import ControllerContext from './ControllerContext';

type Props = {
  portName: string,
  machine: ControlledMachineFragment;
  children: React.ReactNode;
};

const ControllerProvider: React.FunctionComponent<Props> = (props) => {
  const { children, machine } = props;
  const variables = { portName: props.portName };
  const onMachineStateChanged = useMachineStateSubscription({ variables });
  const onMachineConfigurationChanged = useMachineConfigurationSubscription({ variables });
  const onMachineSettingsChanged = useMachineSettingsSubscription({ variables });

  const cm: ControlledMachineFragment = {
    ...machine,
    state: onMachineStateChanged?.data?.machine.state ?? machine.state,
    configuration: onMachineConfigurationChanged?.data?.machine.configuration ?? machine.configuration,
    settings: onMachineSettingsChanged?.data?.machine.settings ?? machine.settings,
  };

  return (
    <ControllerContext.Provider value={{ machine: cm }}>
      {children}
    </ControllerContext.Provider>
  );
};

export default ControllerProvider;
