import * as React from 'react';
import { Grid } from '@material-ui/core';
import {IHaveWorkspace} from '../../Workspaces';
import PortStatus from '../../Ports/PortStatus';
import {useSystemPorts} from '../../../providers/SystemPortHooks';

type Props = IHaveWorkspace;

const Machine: React.FunctionComponent<Props> = (props) => {
  const { workspace } = props;
  const ports = useSystemPorts();
  const portName = workspace.connection.portName;
  const port = ports.portMap[portName];

  return (
    <Grid item xs={12}>
      <PortStatus port={port} showName={true} />
    </Grid>
  );
};

export default Machine;
