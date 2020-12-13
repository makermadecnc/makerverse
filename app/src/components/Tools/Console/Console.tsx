import * as React from 'react';
import { Grid } from '@material-ui/core';
import useStyles from './Styles';
import {ToolBase} from '../types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {useController} from '../../../providers';
// import { FitAddon } from 'xterm-addon-fit';
// import { SearchAddon } from 'xterm-addon-search';
// import { XTerm } from 'xterm-for-react';

const Console: ToolBase = (props) => {
  const log = useLogger(Console);
  const classes = useStyles();
  const controller = useController();

  log.debug('controller', controller.machine.state);
  // const xtermRef = React.useRef(null);
  // const fitAddon = new FitAddon();
  // const searchAddon = new SearchAddon();
  // const addons = [fitAddon, searchAddon];
  // const windowSize = useWindowSize();
  // const curHeight = windowSize.height;
  // const [lastHeight, setLastHeight] = React.useState(0);
  //
  // React.useEffect(() => {
  //   if (Math.abs(curHeight - lastHeight) > 5) {
  //     log.debug('fit changed', lastHeight, 'to', curHeight);
  //     setLastHeight(curHeight);
  //   }
  // }, [curHeight, lastHeight, setLastHeight, fitAddon]);
  //
  // function reFit() {
  //   fitAddon.fit();
  // }
  //
  // function onResize(event: { cols: number, rows: number }) {
  //   log.debug('resize', event);
  // }
  //
  // React.useEffect(reFit, [fitAddon, xtermRef]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>

      </Grid>
    </Grid>
  );
};

export default Console;
