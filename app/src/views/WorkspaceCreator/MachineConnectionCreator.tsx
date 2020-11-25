import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import {useListPortsQuery} from '../../api/graphql';
import useStyles from './Styles';

interface OwnProps {
  children: React.ReactNode;
}

type Props = OwnProps;

const MachineConnectionCreator: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { loading, error, data } = useListPortsQuery();
  const [selectedPort, setSelectedPort] = React.useState<string>('');

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={selectedPort}
        onChange={(e) => setSelectedPort(e.target.value)}
        label="Age"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {data && data.ports.map((port) => {
          return (
            <MenuItem key={port.name} value={port.name}>{port.name}</MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default MachineConnectionCreator;
