import * as React from 'react';
import {MachinePositionFragment} from '../../api/graphql';
import { faMapMarkerAlt, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import {useMakerverseTrans} from '../../providers';
import PopoverWorkBarChip from './PopoverWorkBarChip';
import {HoverHelpStep} from '@openworkshop/ui/components/Alerts';
import { Typography } from '@material-ui/core';
import useStyles from './Styles';
import HelpfulHeader from '@openworkshop/ui/components/Text/HelpfulHeader';

export type PositionType = 'work' | 'machine';

type Props = {
  positionType: PositionType;
  position: MachinePositionFragment;
};

type Axis = 'x' | 'y' | 'z';

const MachinePositionChip: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { positionType, position } = props;
  const isWPos = positionType === 'work';
  const { isValid } = position;
  const icon = isWPos ? faMapMarkerAlt : faMapMarkedAlt;
  const tip = isWPos ?
    t('WPos (work position), relative to the work origin (where the program execution will begin).') :
    t('MPos (machine position), in absolute real-world coordinates.');

  const axes: Axis[] = ['x', 'y', 'z'];
  const positionText = axes.map((a) => position[a]).filter(v => v !== null).join(', ');

  return (<PopoverWorkBarChip faIcon={icon} label={positionText}>
    <HelpfulHeader tip={tip} title={t(isWPos ? 'WPos' : 'MPos')} variant="h6" />
    {isValid}
  </PopoverWorkBarChip>);
};

export default MachinePositionChip;
