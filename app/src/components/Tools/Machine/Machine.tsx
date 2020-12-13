import * as React from 'react';
import { Grid } from '@material-ui/core';
import {ToolBase} from '../types';
import {useController} from '../../../providers';
import useStyles from './Styles';

const Machine: ToolBase = (props) => {
  // const { workspace } = props;
  const classes = useStyles();
  const controller = useController();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        {controller.machine.state.activityState.toString()}
      </Grid>

    </Grid>
  );
};

export default Machine;
