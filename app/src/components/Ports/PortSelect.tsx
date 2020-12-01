import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import {
  Container,
  FormControl,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Typography,
  useTheme
} from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, {FunctionComponent} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {IPortCollection} from '../../providers/SystemPortContext';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import PortStatus from './PortStatus';
import useStyles from './Styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import {PortState} from '../../api/graphql';

interface OwnProps {
  selectedPortName: string;
  setSelectedPortName: (id: string) => void;
}

type Props = OwnProps;

const PortSelect: FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const log = useLogger(PortSelect);
  const portCollection: IPortCollection = useSystemPorts();
  const { selectedPortName, setSelectedPortName } = props;
  const port = portCollection.portMap[selectedPortName];

  log.trace(port, selectedPortName, portCollection);

  function onSelectedPort(e: React.ChangeEvent<{ value: unknown }>) {
    const portName = e.target.value as string;
    log.debug('selected port', portName);
    setSelectedPortName(portName);
  }

  function renderPort(portName: string) {
    const port = portCollection.portMap[portName];
    return (
      <MenuItem key={port.portName} value={port.portName}>
        <ListItemIcon className={classes.portMenuIcon} >
          <Typography variant="subtitle2"><PortStatus port={port} /></Typography>
        </ListItemIcon>
        <Typography variant="subtitle1">{port.portName}</Typography>
      </MenuItem>
    );
  }

  function getHelperText(): string | undefined {
    if (!port) return t('Required');
    if (port.state === PortState.Error) return port.error?.name ?? t('Cannot connect to machine.');
    if (port.state === PortState.Ready) return t('The port must not be in-use by any other programs.');
    return '';
  }

  const helperColor = !port || port.error ? theme.palette.error.main : theme.palette.grey.A700;

  return (
    <Container>
      <FormControl required variant="outlined" className={classes.formControl}>
        <InputLabel ><Trans>Port Name</Trans></InputLabel>
        <Select
          value={selectedPortName}
          onChange={onSelectedPort}
          label="Port Name"
        >
          <MenuItem value="">
            <em><Trans>Please select a port</Trans></em>
          </MenuItem>
          {portCollection.sortedPortNames.map(renderPort)}
        </Select>
        <FormHelperText style={{ color: helperColor.toString() }}>{getHelperText()}</FormHelperText>
        <AlertList errors={portCollection.errors} />
      </FormControl>
    </Container>
  );
};

export default PortSelect;
