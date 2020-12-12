import { Button, Tooltip } from '@material-ui/core';
import * as React from 'react';
import { IMoveRequest } from './types';
import useStyles from './Styles';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import {useMakerverseTrans} from '../../../providers';

type Props = IMoveRequest;

const JogButton: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { xAxis, yAxis, zAxis, type } = props;

  function getIcon() {
    const parts = ['move'];
    if (yAxis && yAxis < 0) parts.push('down');
    if (yAxis && yAxis > 0) parts.push('up');
    if (xAxis && xAxis < 0) parts.push('left');
    if (xAxis && xAxis > 0) parts.push('right');
    if (zAxis && zAxis < 0) parts.push('in');
    if (zAxis && zAxis > 0) parts.push('out');
    if (parts.length === 1) {
      if (xAxis !== undefined || yAxis !== undefined) parts.push('center');
      if (zAxis !== undefined) parts.push('zero');
    }
    return <OpenWorkShopIcon className={classes.jogAxisIcon} name={parts.join('-')} />;
  }

  function getTip() {
    const parts = [];
    if (yAxis && yAxis < 0) parts.push(t('downward (negative Y)'));
    if (yAxis && yAxis > 0) parts.push(t('upward (positive Y)'));
    if (xAxis && xAxis < 0) parts.push(t('leftward (negative X)'));
    if (xAxis && xAxis > 0) parts.push(t('rightward (positive X)'));
    if (zAxis && zAxis < 0) parts.push(t('inward (negative Z)'));
    if (zAxis && zAxis > 0) parts.push(t('outward (positive Z)'));
    if (parts.length === 0) {
      if (xAxis !== undefined || yAxis !== undefined) parts.push(t('to the X/Y center'));
      if (zAxis !== undefined) parts.push(t('to the surface'));
    }
    return t('Move the tip {{ directions }}.', { directions: parts.join(' and ') } );
  }

  return (
    <Tooltip title={getTip()}>
      <Button
        color="primary"
        variant="outlined"
        className={classes.jogAxisButton}
      >
        {getIcon()}
      </Button>
    </Tooltip>
  );
};

export default JogButton;
