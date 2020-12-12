import { MenuItem, Select, Grid, FormControl } from '@material-ui/core';
import * as React from 'react';
import {IHaveWorkspace} from '../Workspaces/types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import useStyles from './Styles';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';

type Props = IHaveWorkspace;

const WorkspaceUnitSelect: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(WorkspaceUnitSelect);
  const classes = useStyles();
  const { workspace } = props;

  function setImperialUnits(val: number) {
    const isImperial = !!val;
    log.debug('imp', isImperial);
  }

  function renderMenuItem(imperial: boolean) {
    const title = imperial ? 'in.' : 'mm.';
    const val = imperial ? 1 : 0;
    const icon = imperial ? 'ruler-imperial' : 'ruler-metric';
    return <MenuItem className={classes.selectMenuItem} value={val} >
      <Grid container>
        <Grid item>
          <OpenWorkShopIcon name={icon} className={classes.selectIcon} />
        </Grid>
        <Grid>{title}</Grid>
      </Grid>
    </MenuItem>;
  }

  return (
    <FormControl className={classes.formControl} >
      <Select
        value={workspace.isImperialUnits ? 1 : 0}
        className={classes.selectMenu}
        onChange={(e) => setImperialUnits(e.target.value)}
      >
        {renderMenuItem(true)}
        {renderMenuItem(false)}
      </Select>
    </FormControl>
  );
};

export default WorkspaceUnitSelect;
