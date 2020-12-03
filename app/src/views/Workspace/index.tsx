import React, { FunctionComponent } from 'react';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import {useWorkspace} from '../../providers';
import {PortState} from '../../api/graphql';
import WorkspaceConnector from './WorkspaceConnector';

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

  if (port?.state !== PortState.Active) {
    return <WorkspaceConnector workspaceId={props.id} port={port} />;
  }

  return (
    <div>
      {props.id}
    </div>
  );
};

export default index;
