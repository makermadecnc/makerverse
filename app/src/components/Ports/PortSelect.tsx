import _ from 'lodash';
import {FormControl, ListItemIcon, MenuItem, Select, Typography } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import {SystemPortFragment, useListPortsQuery} from '../../api/graphql';
import { InputLabel } from '@material-ui/core';
import { Trans } from 'react-i18next';
import PortStatus from './PortStatus';
import useStyles from './Styles';

interface OwnProps {
  selectedPortName: string;
  setSelectedPortName: (id: string) => void;
}

type Props = OwnProps;

const PortSelect: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const log = useLogger(PortSelect);
  const { loading, error, data } = useListPortsQuery();
  const { selectedPortName, setSelectedPortName } = props;
  const ports = data ? _.sortBy(data.ports ?? [], 'portName') : [];

  log.debug(selectedPortName, loading, error, data);

  function onSelectedPort(e: React.ChangeEvent<{ value: unknown }>) {
    const portName = e.target.value as string;
    log.debug('selected port', portName);
    setSelectedPortName(portName);
  }

  function renderPort(port: SystemPortFragment) {
    return (
      <MenuItem key={port.portName} value={port.portName}>
        <ListItemIcon className={classes.portMenuIcon} >
          <Typography variant="subtitle2"><PortStatus port={port} /></Typography>
        </ListItemIcon>
        <Typography variant="subtitle1">{port.portName}</Typography>
      </MenuItem>
    );
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel ><Trans>Port Name</Trans></InputLabel>
      <Select
        value={selectedPortName}
        onChange={onSelectedPort}
        label="Port Name"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {ports.map(renderPort)}
      </Select>
    </FormControl>
  );
};

export default PortSelect;
