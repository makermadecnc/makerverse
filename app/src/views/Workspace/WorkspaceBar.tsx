import {Grid} from '@material-ui/core';
import WorkBar from '@openworkshop/ui/open-controller/WorkBar';
import * as React from 'react';
import {tryUseController} from '@openworkshop/ui/open-controller/Controllers';
import {IHaveWorkspace} from '@openworkshop/ui/open-controller/Workspaces';
import {IMaybeHavePortStatus} from '@openworkshop/ui/open-controller/Ports/types';
import {tryUseGcodeVisualizer} from '@openworkshop/ui/open-controller/GWiz';
import {WorkspaceState} from '@openworkshop/lib/api/graphql';

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
            wiz={workspace.state === WorkspaceState.Active ? wiz : undefined}
          />
        </Grid>
      </Grid>
      {children}
    </React.Fragment>
  );
};

export default WorkspaceBar;
