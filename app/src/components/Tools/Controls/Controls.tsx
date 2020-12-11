import * as React from 'react';
import { Grid } from '@material-ui/core';
import {IHaveWorkspace} from '../../Workspaces';
import JogControls from './JogControls';

type Props = IHaveWorkspace;

const Controls: React.FunctionComponent<Props> = (props) => {
  return (
    <Grid item xs={12}>
      <JogControls />
    </Grid>
  );
};

export default Controls;
