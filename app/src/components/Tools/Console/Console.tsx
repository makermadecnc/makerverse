import * as React from 'react';
import { Grid } from '@material-ui/core';
import { FitAddon } from 'xterm-addon-fit';
import useStyles from './Styles';
import {ToolBase} from '../types';
import { XTerm } from 'xterm-for-react';

const Console: ToolBase = (props) => {
  const classes = useStyles();
  const fitAddon = new FitAddon();
  const addons = [fitAddon];

  React.useEffect(() => {
    fitAddon.fit();
  }, [fitAddon]);

  return (
    <Grid container style={{ padding: 2 }} spacing={2}>
      <Grid item xs={12}>
        <XTerm addons={addons} />
      </Grid>
    </Grid>
  );
};

export default Console;
