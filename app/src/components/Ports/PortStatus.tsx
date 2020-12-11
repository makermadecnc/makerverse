import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, {FunctionComponent} from 'react';
import {PortState} from '../../api/graphql';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUsb} from '@fortawesome/free-brands-svg-icons';
import {faExclamationCircle, faMicrochip, faPlug} from '@fortawesome/free-solid-svg-icons';
import {Typography, useTheme} from '@material-ui/core';
import {IMaybeHavePortStatus} from './types';
import {useMakerverseTrans} from '../../providers';

interface OwnProps {
  showType?: boolean;
  showName?: boolean;
}

type Props = IMaybeHavePortStatus & OwnProps;

const PortStatus: FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const log = useLogger(PortStatus);
  const theme = useTheme();
  const { port, showType, showName } = props;
  const portName = port ? port.portName : undefined;
  const st = port ? port.state : PortState.Unplugged;

  function getPortStatusText() {
    if (!port || st === PortState.Unplugged) return t('Unplugged');

    if (st === PortState.Error) return t('Error');
    if (st === PortState.HasFirmware) return t('Handshaking');
    if (st === PortState.Ready) return t('Available');
    if (st === PortState.Startup) return t('Startup');
    if (st === PortState.Opening) return t('Connecting');
    if (st === PortState.HasData) return t('Querying');

    // It is active, but what kind?
    if (port.connection) {
      if (port.connection.status.bytesToRead > 0) return t('Reading');
      if (port.connection.status.bytesToWrite > 0) return t('Writing');
    }
    return t('Active');
  }

  function getPortColor() {
    if (!port || st === PortState.Unplugged) return theme.palette.grey.A400;
    if (st === PortState.Error) return theme.palette.error.main;
    if (st === PortState.Ready) return theme.palette.primary.light;

    const activeStates = [PortState.Opening, PortState.Startup, PortState.HasData, PortState.HasFirmware];
    const hasData = port.connection &&
      (port.connection.status.bytesToRead > 0 || port.connection.status.bytesToWrite > 0);
    if ((st && activeStates.includes(st)) || hasData) return theme.palette.secondary.dark;

    if (st === PortState.Active) return theme.palette.primary.light;

    return theme.palette.grey.A700;
  }

  function getPortIcon() {
    if (!port || st === PortState.Unplugged) return faUsb;
    if (port.state === PortState.Error) return faExclamationCircle;
    if (!port.connection) return faUsb;
    if (port.state === PortState.Active) return faMicrochip;
    return faPlug;
  }

  const color = getPortColor();
  log.verbose('port', portName, 'status', st);

  return (
    <React.Fragment >
      {showType && port && port.connection && <Typography variant="subtitle1">
        [{port.connection.machine.firmwareRequirement.controllerType}]
      </Typography>}
      {showName && port && port.portName && <Typography variant="subtitle2">
        {port.portName}
      </Typography>}
      <FontAwesomeIcon color={color} icon={ getPortIcon() } style={{ marginRight: theme.spacing(1) }} />
      {' '}{getPortStatusText()}
    </React.Fragment>
  );
};

export default PortStatus;
