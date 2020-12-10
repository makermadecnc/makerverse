import * as React from 'react';
import { Grid } from '@material-ui/core';
import {IHaveWorkspace} from '../../Workspaces';

type Props = IHaveWorkspace;

const WorkspaceSettings: React.FunctionComponent<Props> = (props) => {
  return (
    <Grid item xs={12}>
      Console component
    </Grid>
  );
};

export default WorkspaceSettings;
