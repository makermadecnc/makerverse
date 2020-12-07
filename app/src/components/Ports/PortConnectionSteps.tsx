import {CircularProgress, Container, Step, StepLabel, Stepper, Typography, useTheme} from '@material-ui/core';
import * as React from 'react';
import {useTranslation} from 'react-i18next';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {MachineFirmwareFragment, PortState} from '../../api/graphql';
import {IAlertMessage} from '@openworkshop/ui/components/Alerts';
import {faCircle, faDotCircle, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {StepIconProps} from '@material-ui/core/StepIcon';
import {IMaybeHavePortStatus} from './types';

type Props = IMaybeHavePortStatus & {
 requiredFirmware?: MachineFirmwareFragment;
};

enum ConnectionStep {
  NotOpen = -1,
  OpenConnection = 0,
  ReceiveData,
  CheckProtocol,
  InspectFirmware,
  NumSteps,
}

const StepIcon: React.FunctionComponent<StepIconProps> = (props) => {
  const theme = useTheme();
  const { active, completed, error } = props;

  if (completed) return <FontAwesomeIcon color={theme.palette.primary.main} icon={faDotCircle} />;
  if (error) return <FontAwesomeIcon color={theme.palette.error.main} icon={faExclamationCircle} />;
  if (active) return <CircularProgress size={16} />;
  return <FontAwesomeIcon icon={faCircle} />;
};

const PortConnectionSteps: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(PortConnectionSteps);
  const { t } = useTranslation();
  const { port } = props;
  const portState = port?.state ?? PortState.Unplugged;
  const [lastPortState, setLastPortState] = React.useState(PortState.Unplugged);
  const [activeStep, setActiveStep] = React.useState(ConnectionStep.NotOpen);
  const stepsNumbers = [...Array(ConnectionStep.NumSteps).keys()];

  function getName(step: ConnectionStep) {
    if (step === ConnectionStep.NotOpen) return t('Not Open');
    if (step === ConnectionStep.OpenConnection) return t('Open Connection');
    if (step === ConnectionStep.ReceiveData) return t('Receive Data');
    if (step === ConnectionStep.CheckProtocol) return t('Check Protocol');
    if (step === ConnectionStep.InspectFirmware) return t('Inspect Firmware');
    return t('Unknown');
  };

  function getTip(step: ConnectionStep) {
    if (step === ConnectionStep.NotOpen) return t('This port is not open.');
    if (step === ConnectionStep.OpenConnection) return t('Asking the computer for access to the port...');
    if (step === ConnectionStep.ReceiveData) return t('Waiting for data from the machine...');
    if (step === ConnectionStep.CheckProtocol) return t('Checking if data from machine is understood...');
    if (step === ConnectionStep.InspectFirmware) return t('Ensuring compatible firmware...');
    return t('Unknown');
  }

  function getError(step: ConnectionStep): IAlertMessage | undefined {
    if (step === ConnectionStep.OpenConnection && port?.error) return port.error;
    return undefined;
  }

  // Manage step progression.
  React.useEffect(() => {
    if (portState === lastPortState) return;
    if (portState === PortState.Error) setActiveStep(ConnectionStep.OpenConnection);
    if (portState === PortState.Ready || portState === PortState.Unplugged) setActiveStep(ConnectionStep.NotOpen);
    if (portState === PortState.Opening) setActiveStep(ConnectionStep.OpenConnection);
    if (portState === PortState.Startup) setActiveStep(ConnectionStep.ReceiveData);
    if (portState === PortState.HasData) setActiveStep(ConnectionStep.CheckProtocol);
    if (portState === PortState.HasFirmware) setActiveStep(ConnectionStep.InspectFirmware);
    if (portState === PortState.Active) setActiveStep(ConnectionStep.NumSteps);
    log.debug('port state changed from', lastPortState, 'to', portState);
    setLastPortState(portState);
  }, [activeStep, setActiveStep, portState, lastPortState, setLastPortState]);

  return (
    <Container>
      <Stepper activeStep={activeStep} orientation="vertical" >
        {stepsNumbers.map((num) => {
          const error: IAlertMessage | undefined = num <= activeStep ? getError(num) : undefined;
          const showCaption = error || num === activeStep;
          return (
            <Step key={num} >
              <StepLabel StepIconComponent={StepIcon} error={!!error} >{getName(num)}</StepLabel>
              {showCaption && <Typography variant="caption" color={error ? 'error' : 'inherit'} >
                {error && error.message}
                {!error && getTip(num)}
              </Typography>}
            </Step>
          );
        })}
      </Stepper>
    </Container>
  );
};

export default PortConnectionSteps;
