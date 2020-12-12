import {Tooltip, Grid, Select, MenuItem, FormControl} from '@material-ui/core';
import * as React from 'react';
import {IHaveGWiz, ViewPlane} from '../GWiz';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import {useMakerverseTrans} from '../../providers';
import useStyles, {tooltipDelay} from './Styles';

type Props = IHaveGWiz;

const ViewModeSelect: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { wiz } = props;
  const { viewPlane, setViewPlane } = wiz.preferences;
  const planeNumbers = [...Array(ViewPlane.NumPlanes).keys()];

  function getName(vp: ViewPlane) {
    if (vp === ViewPlane.None) return t('3D');
    if (vp === ViewPlane.Top) return t('Top');
    if (vp === ViewPlane.Bottom) return t('Bottom');
    if (vp === ViewPlane.Left) return t('Left');
    if (vp === ViewPlane.Right) return t('Right');
    if (vp === ViewPlane.Front) return t('Front');
    if (vp === ViewPlane.Back) return t('Back');
    return '';
  }

  function getIcon(vp: ViewPlane) {
    if (vp === ViewPlane.None) return 'view-3d';
    if (vp === ViewPlane.Top) return 'view-top';
    if (vp === ViewPlane.Left) return 'view-left';
    if (vp === ViewPlane.Right) return 'view-right';
    if (vp === ViewPlane.Front) return 'view-front';
    return 'view-unknown';
  }

  return (
    <Tooltip title={t('The camera view mode for the 3D workspace, below.')} enterDelay={tooltipDelay}>
      <FormControl className={classes.formControl} >
        <Select
          id="view-mode"
          value={viewPlane}
          className={classes.selectMenu}
          onChange={(e) => setViewPlane(e.target.value)}
          label={t('Axis Movement Amounts')}
        >
          {planeNumbers.map(s => {
            return <MenuItem key={s} value={s} className={classes.selectMenuItem} >
              <Grid container>
                <Grid item>
                  <OpenWorkShopIcon name={getIcon(s)} className={classes.selectIcon} />
                </Grid>
                <Grid>{getName(s)}</Grid>
              </Grid>
            </MenuItem>;
          })}
        </Select>
      </FormControl>
    </Tooltip>
  );
};

export default ViewModeSelect;
