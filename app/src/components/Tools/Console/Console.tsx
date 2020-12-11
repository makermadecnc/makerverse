import * as React from 'react';
import { Grid } from '@material-ui/core';
import {IHaveWorkspace} from '../../Workspaces';
import useStyles from './Styles';

type Props = IHaveWorkspace;

const Console: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  return (
    <Grid item xs={12} className={classes.root} >
      Console component
    </Grid>
  );
};

export default Console;
