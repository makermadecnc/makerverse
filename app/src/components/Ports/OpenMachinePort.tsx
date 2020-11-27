import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug } from '@fortawesome/free-solid-svg-icons';
import { Fab, Typography, Grid, useTheme } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Trans } from 'react-i18next';
import PortSelect from '../../components/Ports/PortSelect';
import useStyles from './Styles';

interface OwnProps {
  machine: React.ReactNode;
}

type Props = OwnProps;

const OpenMachinePort: FunctionComponent<Props> = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const { machine } = props;
  const [selectedPortName, setSelectedPortName] = React.useState<string>('');
  const hasPort = selectedPortName.length > 0;
  // const [openPortMutation, { data, loading, error }] = open

  return (
    <Grid container spacing={4} style={{ marginBottom: theme.spacing(2) }}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Trans>Connect to your Machine's Port</Trans>
        </Typography>
        <Typography variant='body2'>
          <Trans>The port is the physical connection on the Makerverse host (e.g., USB).</Trans>
        </Typography>
      </Grid>
      <Grid item xs={6} className={classes.portSelectItem} >
        <PortSelect
          selectedPortName={selectedPortName}
          setSelectedPortName={setSelectedPortName}
        />
      </Grid>
      <Grid item xs={6} >
        <Fab
          color='primary'
          type='submit'
          variant='extended'
          size='large'
          className={classes.connectButton}
          disabled={!hasPort}
        >
          <FontAwesomeIcon className={classes.connectIcon} icon={faPlug} />
          <Typography variant="h6"><Trans>Connect</Trans></Typography>
        </Fab>
      </Grid>
    </Grid>
  );
};

export default OpenMachinePort;
