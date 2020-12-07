import * as React from 'react';
import {IHaveWorkspace} from './types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { Typography } from '@material-ui/core';
import PortStatus from '../Ports/PortStatus';
import {IMaybeHavePortStatus} from '../Ports/types';

type Props = IHaveWorkspace & IMaybeHavePortStatus;

const WorkspaceStatus: React.FunctionComponent<Props> = (props) => {
  const { log } = useLogger(WorkspaceStatus);
  const { workspace, port } = props;
  //
  // function getIcon() {
  // }

  return (
    <PortStatus port={port} />
  );
};

export default WorkspaceStatus;
