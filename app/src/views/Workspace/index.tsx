import React, {FunctionComponent, ReactNode} from 'react';
import {useSystemPorts} from '@openworkshop/ui/open-controller/Ports';
import {useWorkspace, useWorkspaceEvent} from '@openworkshop/ui/open-controller/Context';
import {
  WorkspaceState
} from '@openworkshop/lib/api/graphql';
import WorkspaceConnector from './WorkspaceConnector';
import {WorkspaceEventType} from '@openworkshop/ui/open-controller/Workspaces/types';
import ControllerProvider from '@openworkshop/ui/open-controller/Controllers/ControllerProvider';
import Workspace from './Workspace';

interface OwnProps {
  id: string;
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
  const ports = useSystemPorts();
  const workspace = useWorkspace(props.id);
  const port = ports.portMap[workspace.connection.portName];

  useWorkspaceEvent(workspace, WorkspaceEventType.State);

  // Controls [Axes, Homing, Spindle/Laser, Hotend, Console(?)]
  // Project [Visualizer, Webcam, Gcode]
  // Settings [Machine Settings, Calibration, Probe, Test Laser, Edit Workspace]

  if (workspace.state !== WorkspaceState.Active || !workspace.machine)
    return <WorkspaceConnector workspaceId={props.id} port={port} />;

  return <ControllerProvider portName={port.portName} machine={workspace.machine} >
    {<Workspace port={port} workspace={workspace} />}
  </ControllerProvider>;
};

export default index;
