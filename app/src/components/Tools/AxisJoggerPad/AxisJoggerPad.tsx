import * as React from 'react';
import { Grid } from '@material-ui/core';
import {ToolBase} from '../types';
import {IMoveRequest} from './types';
import JogButton from './JogButton';
import useStyles from './Styles';
import JogStepSelect from './JogStepSelect';
import {useMakerverseTrans} from '../../../providers';

const AxisJoggerPad: ToolBase = (props) => {
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { workspace } = props;
  const [xyStep, setXyStep] = React.useState<number>(1);
  const [zStep, setZStep] = React.useState<number>(1);
  const zSteps = workspace.getAxisSteps(workspace.axes.Z);
  const xySteps = workspace.getAxisSteps(workspace.axes.X);

  const reqs: IMoveRequest[] = [
    { xAxis: -xyStep, yAxis: xyStep },
    { xAxis: 0, yAxis: xyStep },
    { xAxis: xyStep, yAxis: xyStep },
    { zAxis: zStep },
    { xAxis: -xyStep, yAxis: 0 },
    { type: 'absolute', xAxis: 0, yAxis: 0 },
    { xAxis: xyStep, yAxis: 0 },
    { type: 'absolute', zAxis: 0 },
    { xAxis: -xyStep, yAxis: -xyStep },
    { xAxis: 0, yAxis: -xyStep },
    { xAxis: xyStep, yAxis: -xyStep },
    { zAxis: -zStep },
  ];

  function renderJogButtonCell(req: IMoveRequest) {
    return <Grid key={reqs.indexOf(req)} item xs={3}><JogButton {...req} /></Grid>;
  }

  return (
    <Grid container spacing={1} className={classes.root} >
      <Grid item xs={6}>
        <JogStepSelect
          title={t('X/Y Axis Step')}
          stepValue={xyStep}
          setStepValue={setXyStep}
          steps={xySteps}
        />
      </Grid>
      <Grid item xs={6}>
        <JogStepSelect
          title={t('Z Axis Step')}
          stepValue={zStep}
          setStepValue={setZStep}
          steps={zSteps}
        />
      </Grid>
      {reqs.map((req) => {
        return renderJogButtonCell(req);
      })}
    </Grid>
  );
};

export default AxisJoggerPad;
