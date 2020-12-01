import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlug, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import {Fab, Grid, Paper, Typography, useTheme, Modal} from '@material-ui/core';
import {ICustomizedMachine} from '@openworkshop/lib/api/Machines/CustomizedMachine';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, {FunctionComponent} from 'react';
import {Trans, useTranslation} from 'react-i18next';
import HoverHelpStep from '@openworkshop/ui/components/Alerts/HoverHelpStep';
import {
  FirmwareRequirementInput,
  MutationOpenPortArgs,
  PortState,
  SerialPortOptionsInput,
  useClosePortMutation,
  useOpenPortMutation
} from '../../api/graphql';
import PortSelect from '../../components/Ports/PortSelect';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import useStyles from './Styles';
import PortConnectionSteps from './PortConnectionSteps';

interface OwnProps {
  machine: ICustomizedMachine;
}

type Props = OwnProps;

const OpenMachinePort: FunctionComponent<Props> = (props) => {
  const log = useLogger(OpenMachinePort);
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();
  const portCollection = useSystemPorts();
  const [openPort, openedPort] = useOpenPortMutation();
  const [closePort, closedPort] = useClosePortMutation();
  const { machine } = props;
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedPortName, setSelectedPortName] = React.useState<string>('');
  const port = portCollection.portMap[selectedPortName];
  const isConnected = port && port.connection;
  const isConnecting = port && port.state === PortState.Opening;
  const isActive = port && port.state === PortState.Active;
  // const showSteps = isConnecting || isConnected;
  // const hasConnectionError = port && port.error;
  // const didOpenConnection = data && data.port && data.port.portName === port.portName;
  // const inUseDisabled = !allowInUse && !didOpenConnection && isConnected;
  const canConnect = machine && port && !isConnected && !isConnecting;
  // const [openPortMutation, { data, loading, error }] = open

  async function onPressConnect() {
    // TODO: These may need to be configurable...
    const opts: SerialPortOptionsInput = {
      baudRate: machine.firmware.baudRate as number,
      dataBits: null,
      handshake: null,
      parity: null,
      readBufferSize: null,
      readTimeout: null,
      rtsEnable: machine.firmware.rtscts,
      stopBits: null,
      writeBufferSize: null,
      writeTimeout: null,
    };

    const fw: FirmwareRequirementInput = {
      name: machine.firmware.name ?? null,
      edition: machine.firmware.edition ?? null,
      value: machine.firmware.value ?? null,
      controllerType: machine.firmware.controllerType,
    };

    const args: MutationOpenPortArgs = {
      friendlyName: 'CreateWorkspace',
      portName: selectedPortName,
      firmware: fw,
      options: opts,
    };
    log.debug('opening port...', args);
    await openPort({ variables: args });
    log.debug('opened?', openedPort.data?.port);
  }

  async function onPressDisconnect() {
    log.debug('closing port', port.portName);
    await closePort({ variables: { portName: port.portName }});
    log.debug('closed?', closedPort.data?.port);
  }

  React.useEffect(() => {
    if (isActive) {
      log.debug('Connection now active; finalize workspace.');
      setModalOpen(true);
    }
  }, [isActive, setModalOpen]);

  async function closeModal() {
    await onPressDisconnect();
    setModalOpen(false);
  }

  return (
    <Paper style={{ padding: theme.spacing(2), marginBottom: theme.spacing(2) }} >
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Typography variant='h5'>
            <Trans>Connect to your Machine's Port</Trans>

            <HoverHelpStep
              tip={t('Makerverse will attempt to communicate with the device via the port, testing to see if it' +
                ' understands the output.')}
              isComplete={false}
            />
          </Typography>
          <Typography variant='body2'>
            <Trans>The port is the physical connection on the Makerverse host (e.g., USB).</Trans>
          </Typography>
        </Grid>
        <Grid item xs={9} className={classes.portSelectItem} >
          <PortSelect
            selectedPortName={selectedPortName}
            setSelectedPortName={setSelectedPortName}
          />
        </Grid>
        <Grid item xs={3} >
          {!isConnected && <Fab
            color='primary'
            type='submit'
            variant='extended'
            size='large'
            onClick={onPressConnect}
            className={classes.connectButton}
            disabled={!canConnect}
          >
            <FontAwesomeIcon className={classes.connectIcon} icon={faPlug} />
            <Typography variant="h6">{isConnecting ? t('Connecting...') : t('Connect')}</Typography>
          </Fab>}
          {isConnected && <Fab
            color='secondary'
            type='submit'
            variant='extended'
            size='large'
            onClick={onPressDisconnect}
            className={classes.connectButton}
          >
            <FontAwesomeIcon className={classes.connectIcon} icon={faPowerOff} />
            <Typography variant="h6"><Trans>Disconnect</Trans></Typography>
          </Fab>}
        </Grid>
        <Grid item xs={12} style={{ minHeight: 60, paddingTop: 0, marginTop: 0 }} >
          {port && port.state !== PortState.Ready && <PortConnectionSteps port={port} />}
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-create-workspace"
        aria-describedby="modal-create-workspace"
      >
        <div>Are you sure?</div>
      </Modal>
    </Paper>
  );
};

export default OpenMachinePort;
