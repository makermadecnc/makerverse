import * as React from 'react';
import { Grid } from '@material-ui/core';
import JogControls from './JogControls';
import {ToolBase} from '../types';

const Controls: ToolBase = (props) => {
  return (
    <Grid item xs={12}>
      <JogControls />
    </Grid>
  );
};

export default Controls;
