import React, {FunctionComponent} from 'react';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import {useWorkspace, useWorkspaceEvent} from '../../providers';
import {WorkspaceState} from '../../api/graphql';
import WorkspaceConnector from './WorkspaceConnector';
import {WorkspaceEventType} from '../../lib/workspaces/types';
import useStyles from './Styles';
import ToolBar from './ToolBar';

interface OwnProps {
  id: string;
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
  //const workspaces: Workspaces = useWorkspaces();
  //const workspace = workspaces.all[props.id];
  const ports = useSystemPorts();
  const workspace = useWorkspace(props.id);
  const classes = useStyles();
  const port = ports.portMap[workspace.connection.portName];

  useWorkspaceEvent(workspace, WorkspaceEventType.State);

  if (workspace.state !== WorkspaceState.Active) {
    return <WorkspaceConnector workspaceId={props.id} port={port} />;
  }
  // Controls [Axes, Homing, Spindle/Laser, Hotend, Console(?)]
  // Project [Visualizer, Webcam, Gcode]
  // Settings [Machine Settings, Calibration, Probe, Test Laser, Edit Workspace]

  return (
    <React.Fragment>
      <ToolBar workspace={workspace} />
    </React.Fragment>
  );
};

export default index;
