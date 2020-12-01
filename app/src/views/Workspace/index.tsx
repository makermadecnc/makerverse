import React, { FunctionComponent } from 'react';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import {useWorkspace} from '../../providers';
import {PortState} from '../../api/graphql';

interface OwnProps {
  id: string;
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
  //const workspaces: Workspaces = useWorkspaces();
  //const workspace = workspaces.all[props.id];
  const ports = useSystemPorts();
  const workspace = useWorkspace(props.id);
  const port = ports.portMap[workspace.connection.portName];

  if (!port) {
    return <div>Port missing (unplugged).</div>;
  }

  if (port.state !== PortState.Active) {
    return <div>{port.state}</div>;
  }

  return (
    <div>
      {props.id}
    </div>
  );
};

export default index;
