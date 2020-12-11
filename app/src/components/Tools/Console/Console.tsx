import * as React from 'react';
import { Grid } from '@material-ui/core';
import useStyles from './Styles';
import {ToolBase} from '../types';

const Console: ToolBase = (props) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.root} >
      Console component
    </Grid>
  );
};

export default Console;
