import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import {useMakerverseTrans} from '../../../providers';
import useStyles from './Styles';

type Props = {
  title: string;
  stepValue: number;
  setStepValue: (v: number) => void;
  steps: number[];
};

const JogStepSelect: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const classes = useStyles();
  const { title, setStepValue, steps } = props;
  const stepValue = steps.includes(props.stepValue) ? props.stepValue : steps[0];

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel >{title}</InputLabel>
      <Select
        value={stepValue}
        className={classes.numberSelect}
        onChange={(e) => setStepValue(e.target.value)}
        label={t('Axis Movement Amounts')}
      >
        {steps.map(s => {
          return <MenuItem key={s} value={s} >{s}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default JogStepSelect;
