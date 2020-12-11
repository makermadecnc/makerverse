import { Grid } from '@material-ui/core';
import * as React from 'react';

type Props = {

};

const JogControls: React.FunctionComponent<Props> = (props) => {
  return (
    <Grid container>
      <Grid item xs={4}>1</Grid>
      <Grid item xs={4}>2</Grid>
      <Grid item xs={4}>3</Grid>
      <Grid item xs={4}>1</Grid>
      <Grid item xs={4}>2</Grid>
      <Grid item xs={4}>3</Grid>
      <Grid item xs={4}>1</Grid>
      <Grid item xs={4}>2</Grid>
      <Grid item xs={4}>3</Grid>
    </Grid>
  );
};

export default JogControls;
