import * as React from 'react';
import {IHaveWorkspace} from '../Workspaces/types';
import {IMaybeHavePortStatus} from '../Ports/types';
import useStyles from './Styles';
import {Button, ButtonGroup, IconButton, Tooltip, Typography} from '@material-ui/core';
import {useMakerverseTrans} from '../../providers';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCogs, faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {IMaybeHaveController} from '../../providers/ControllerContext';
import MachinePositionChip from './MachinePositionChip';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {IMaybeHaveGWiz} from '../GWiz';
import ViewModeSelect from './ViewModeSelect';
import WorkspaceUnitSelect from './WorkspaceUnitSelect';
import PortStatusChip from './PortStatusChip';
import WorkspaceSettingsDialog from '../Workspaces/WorkspaceSettingsDialog';
import {PortState, WorkspaceState} from '../../api/graphql';
import FirmwareChip from './FirmwareChip';

type Props = IHaveWorkspace & IMaybeHavePortStatus & IMaybeHaveController & IMaybeHaveGWiz & {
  orientation?: 'horizontal' | 'vertical';
}

const WorkBar: React.FunctionComponent<Props> = (props) => {
  const classes = useStyles();
  const log = useLogger(WorkBar);
  const t = useMakerverseTrans();
  const [ settingsOpen, setSettingsOpen ] = React.useState<boolean>(false);
  const { workspace, controller, wiz, port, orientation } = props;
  const machineState = controller?.machine.state;
  const fwRequirement = controller?.machine.firmwareRequirement;
  const fwDetected = controller?.machine.configuration.firmware;
  const machinePosition = machineState ? machineState.machinePosition : undefined;
  const workPosition = machineState ? machineState.workPosition : undefined;
  const portState = port?.state ?? PortState.Unplugged;

  log.verbose(fwRequirement, fwDetected);

  return (
    <div className={classes.root}>
      <ButtonGroup
        className={classes.titleBarButtonGroup}
        color="primary"
        variant="text"
        orientation={orientation ?? 'horizontal'}
        aria-label={t('Workspace Shortcuts')}
      >
        <Button onClick={() => setSettingsOpen(true)} className={classes.titleBarButton}>
          <FontAwesomeIcon icon={faCogs} size={'lg'} />
        </Button>
        <PortStatusChip port={port} />
        {portState === PortState.Unplugged && (
          <Tooltip title={t('Port is not plugged in')} >
            <Button
              color="primary"
            >
              <FontAwesomeIcon icon={faExclamationCircle} className={classes.error} />
            </Button>
          </Tooltip>
        )}
        {fwDetected && <FirmwareChip detectedFirmware={fwDetected} requiredFirmware={fwRequirement} />}
        {machinePosition && <MachinePositionChip positionType="machine" position={machinePosition} />}
        {workPosition && <MachinePositionChip positionType="work" position={workPosition} />}
        {workspace.state === WorkspaceState.Active && <WorkspaceUnitSelect workspace={workspace} />}
        {wiz && <ViewModeSelect wiz={wiz} />}
      </ButtonGroup>
      <WorkspaceSettingsDialog
        workspace={workspace}
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default WorkBar;
