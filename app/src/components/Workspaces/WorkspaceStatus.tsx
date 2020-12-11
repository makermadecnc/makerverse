import * as React from 'react';
import {IHaveWorkspace} from './types';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import PortStatus from '../Ports/PortStatus';
import {IMaybeHavePortStatus} from '../Ports/types';
import {WorkspaceState} from '../../api/graphql';
import {faUsb} from '@fortawesome/free-brands-svg-icons';
import {faDraftingCompass, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTheme} from '@material-ui/core';
import {useMakerverseTrans, useWorkspaceEvent} from '../../providers';
import {WorkspaceEventType} from '../../lib/workspaces/types';

type Props = IHaveWorkspace & IMaybeHavePortStatus;

const WorkspaceStatus: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const log = useLogger(WorkspaceStatus);
  const { workspace, port } = props;
  const st = workspace.state;
  const theme = useTheme();

  useWorkspaceEvent(workspace, WorkspaceEventType.State);

  if (st === WorkspaceState.Opening) return <PortStatus port={port} />;

  function getStatusText() {
    if (!workspace || st === WorkspaceState.Disconnected) return t('Unplugged');
    if (st === WorkspaceState.Closed) return t('Closed');
    if (st === WorkspaceState.Deleted) return t('Deleted');
    if (st === WorkspaceState.Error) return t('Error');
    if (st === WorkspaceState.Active) return t('Active');
    return st.toString() + '?';
  }

  function getIcon() {
    if (!workspace || st === WorkspaceState.Disconnected) return faUsb;
    if (st === WorkspaceState.Error || st === WorkspaceState.Deleted) return faExclamationCircle;
    if (st === WorkspaceState.Active) return faDraftingCompass;
    return faUsb;
  }

  function getColor() {
    if (!workspace || st === WorkspaceState.Disconnected) return theme.palette.grey.A400;
    if (st === WorkspaceState.Closed) return theme.palette.grey.A700;
    if (st === WorkspaceState.Error || st === WorkspaceState.Deleted) return theme.palette.error.main;
    if (st === WorkspaceState.Active) return theme.palette.primary.main;
    return theme.palette.secondary.main;
  }

  const color = getColor();

  return (
    <React.Fragment >
      <FontAwesomeIcon color={color} icon={getIcon()} style={{ marginRight: theme.spacing(1) }} />
      {' '}{getStatusText()}
    </React.Fragment>
  );
};

export default WorkspaceStatus;
