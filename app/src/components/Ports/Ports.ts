import { useTheme } from '@material-ui/core';
import {PortState, PortStatusFragment} from '../../api/graphql';
import {useMakerverseTrans} from '../../providers';
import {faUsb} from '@fortawesome/free-brands-svg-icons';
import {faExclamationCircle, faPlug} from '@fortawesome/free-solid-svg-icons';

export function getPortStatusText(port?: PortStatusFragment) {
  const t = useMakerverseTrans();
  const st = port?.state;
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

export function doesPortHaveData(port?: PortStatusFragment): boolean {
  return !!port && !!port.connection &&
    (port.connection.status.bytesToRead > 0 || port.connection.status.bytesToWrite > 0);
}

export function getPortColor(port?: PortStatusFragment) {
  const theme = useTheme();
  const st = port?.state;
  if (!port || st === PortState.Unplugged) return theme.palette.grey.A400;
  if (st === PortState.Error) return theme.palette.error.main;
  if (st === PortState.Ready) return theme.palette.primary.light;

  const activeStates = [PortState.Opening, PortState.Startup, PortState.HasData, PortState.HasFirmware];
  const hasData = doesPortHaveData(port);
  if ((st && activeStates.includes(st)) || hasData) return theme.palette.secondary.dark;

  if (st === PortState.Active) return theme.palette.secondary.dark;

  return theme.palette.grey.A700;
}

export function getPortIcon(port?: PortStatusFragment) {
  const t = useMakerverseTrans();
  const st = port?.state;
  if (!port || st === PortState.Unplugged) return faUsb;
  if (port.state === PortState.Error) return faExclamationCircle;
  if (!port.connection) return faUsb;
  if (port.state === PortState.Active) return faUsb;
  return faPlug;
}
