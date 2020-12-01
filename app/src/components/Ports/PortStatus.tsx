import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, {FunctionComponent} from 'react';
import {PortState, PortStatusFragment} from '../../api/graphql';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUsb} from '@fortawesome/free-brands-svg-icons';
import {faPlug, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from '@material-ui/core';

interface OwnProps {
  port?: PortStatusFragment;
}

type Props = OwnProps;

const PortStatus: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const log = useLogger(PortStatus);
  const theme = useTheme();
  const { port } = props;
  const portName = port ? port.portName : undefined;
  const st = port ? port.state : undefined;

  function getPortStatusText() {
    if (!port) return t('Unplugged');

    if (st === PortState.Error) return t('Error');
    if (st === PortState.HasFirmware) return t('Handshaking');
    if (st === PortState.Ready) return t('Available');
    if (st === PortState.Startup) return t('Startup');
    if (st === PortState.Opening) return t('Connecting');
    if (st === PortState.HasData) return t('Querying');
    if (st === PortState.Unknown) return t('Unknown');

    // It is active, but what kind?
    if (port.connection) {
      if (port.connection.status.bytesToRead > 0) return t('Reading');
      if (port.connection.status.bytesToWrite > 0) return t('Writing');
    }
    return t('Active');
  }

  function getPortColor() {
    if (!port) return theme.palette.grey.A400;
    if (st === PortState.Error) return theme.palette.error.main;
    if (st === PortState.Unknown) return theme.palette.warning.main;

    const activeStates = [PortState.Opening, PortState.Startup, PortState.HasData, PortState.HasFirmware];
    const hasData = port.connection &&
      (port.connection.status.bytesToRead > 0 || port.connection.status.bytesToWrite > 0);
    if ((st && activeStates.includes(st)) || hasData) return theme.palette.secondary.dark;

    return theme.palette.grey.A700;
  }

  function getPortIcon() {
    if (!port) return faUsb;
    if (port.state === PortState.Error) return faExclamationCircle;
    if (!port.connection) return faUsb;
    return faPlug;
  }

  const color = getPortColor();

  return (
    <React.Fragment >
      <FontAwesomeIcon color={color} icon={ getPortIcon() } style={{ marginRight: theme.spacing(1) }} />
      {' '}{getPortStatusText()}
    </React.Fragment>
  );
};

export default PortStatus;
