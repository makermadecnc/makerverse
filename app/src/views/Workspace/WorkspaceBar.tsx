import {Box, Grid } from '@material-ui/core';
import WorkBar from 'components/WorkBar';
import * as React from 'react';
import {tryUseController} from '../../providers';
import {IHaveWorkspace} from '../../components/Workspaces';
import {IMaybeHavePortStatus} from '../../components/Ports/types';
import {tryUseGcodeVisualizer} from '../../components/GWiz';

type Props = IHaveWorkspace & IMaybeHavePortStatus & {
 children: React.ReactNode;
};

const WorkspaceBar: React.FunctionComponent<Props> = (props) => {
  const controller = tryUseController();
  const wiz = tryUseGcodeVisualizer();
  const { workspace, port, children } = props;

  return (
    <React.Fragment>
      <Grid container >
        <Grid item xs={12}>
          <WorkBar
            workspace={workspace}
            port={port}
            controller={controller}
            wiz={wiz}
          />
        </Grid>
      </Grid>
      {children}
    </React.Fragment>
  );
};

export default WorkspaceBar;
