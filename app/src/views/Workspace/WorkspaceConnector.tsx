import * as React from 'react';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import PortConnectionSteps from '@openworkshop/ui/open-controller/Ports/PortConnectionSteps';
import {IHaveWorkspaceId} from '@openworkshop/ui/open-controller/Workspaces';
import {useWorkspace} from '@openworkshop/ui/open-controller/Context';
import { Grid } from '@material-ui/core';
import {IMaybeHavePortStatus} from '@openworkshop/ui/open-controller/Ports/types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import OpenWorkspaceButton from './OpenWorkspaceButton';
import WorkspaceBar from './WorkspaceBar';
import {useSystemPorts} from '@openworkshop/ui/open-controller/Ports';

type Props = IHaveWorkspaceId & IMaybeHavePortStatus;

const WorkspaceConnector: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(WorkspaceConnector);
  const { workspaceId } = props;
  const ports = useSystemPorts();
  const workspace = useWorkspace(workspaceId);
  const portName = workspace.connection.portName;
  const port = ports.portMap[portName];

  return (
    <WorkspaceBar workspace={workspace} port={port}>
      <ThreeColumns size="md" >
        <ToolbarCard
          title={workspace.name}
          footer={<OpenWorkspaceButton workspace={workspace} />}
        >
          <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8} style={{ justifyContent: 'center' }}>
              <PortConnectionSteps port={port} />
            </Grid>
            <Grid item xs={2} />
          </Grid>
        </ToolbarCard>
      </ThreeColumns>
    </WorkspaceBar>
  );
};

export default WorkspaceConnector;
