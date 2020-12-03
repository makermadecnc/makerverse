import * as React from 'react';
import ThreeColumns from '@openworkshop/ui/components/Layout/ThreeColumns';
import ToolbarCard from '@openworkshop/ui/components/Cards/ToolbarCard';
import PortConnectionSteps from '../../components/Ports/PortConnectionSteps';
import {useTranslation} from 'react-i18next';
import PortStatus from '../../components/Ports/PortStatus';
import {IHaveWorkspaceId} from '../../components/Workspaces/types';
import {useWorkspace} from '../../providers';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import { Grid } from '@material-ui/core';
import {IMaybeHavePortStatus} from '../../components/Ports/types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import OpenWorkspaceButton from '../../components/Workspaces/OpenWorkspaceButton';

type Props = IHaveWorkspaceId & IMaybeHavePortStatus;

const WorkspaceConnector: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(WorkspaceConnector);
  const { t } = useTranslation();
  const ports = useSystemPorts();
  const workspace = useWorkspace(props.workspaceId);
  const portName = workspace.connection.portName;
  const port = ports.portMap[portName];

  function onConnectedToMachine() {
    log.debug('workspace connected');
  }

  return (
    <ThreeColumns size="md" >
      <ToolbarCard
        title={workspace.name}
        subHeader={<PortStatus showType={true} showName={true} port={port} />}
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
  );
};

export default WorkspaceConnector;
