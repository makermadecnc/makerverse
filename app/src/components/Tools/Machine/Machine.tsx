import * as React from 'react';
import { Grid } from '@material-ui/core';
import PortStatus from '../../Ports/PortStatus';
import {useSystemPorts} from '../../../providers/SystemPortHooks';
import {ToolBase} from '../types';

const Machine: ToolBase = (props) => {
  const { workspace } = props;
  const ports = useSystemPorts();
  const portName = workspace.connection.portName;
  const port = ports.portMap[portName];

  return (
    <Grid container>
      <PortStatus port={port} showName={true} />
    </Grid>
  );
};

export default Machine;
