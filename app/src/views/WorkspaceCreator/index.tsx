import {Typography } from '@material-ui/core';
import {ICustomizedMachine} from '@openworkshop/lib/api/Machines/CustomizedMachine';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import CustomizeMachine from '@openworkshop/ui/components/MachineProfiles/CustomizeMachine';
import React, { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import OpenMachinePort from '../../components/Ports/OpenMachinePort';
import CreateWorkspaceModal from './CreateWorkspaceModal';

const WorkspaceCreator: FunctionComponent = () => {
  const log = useLogger(WorkspaceCreator);
  const { t } = useTranslation();
  const [machine, setMachine] = React.useState<ICustomizedMachine | undefined>(undefined);
  const [selectedPortName, setSelectedPortName] = React.useState<string>('');
  const [modalOpen, setModalOpen] = React.useState(false);

  function onCustomized(cust?: ICustomizedMachine) {
    log.verbose(cust);
    setMachine(cust);
  }

  function onClosedModal() {
    setModalOpen(false);
  }

  return (
    <React.Fragment>
      <Typography variant='h5'>
        <Trans>Create Workspace</Trans>
      </Typography>
      <Typography variant="subtitle2">
        <Trans>By connecting to a CNC or 3D Printer machine attached to the Makeverse computer.</Trans>
      </Typography>
      <CustomizeMachine
        tip={t('Select a machine, above, so that you may connect to it.')}
        onCustomized={onCustomized}
      />
      {machine && <OpenMachinePort
        machine={machine}
        onConnected={() => setModalOpen(true)}
        selectedPortName={selectedPortName}
        setSelectedPortName={setSelectedPortName}
      />}
      <CreateWorkspaceModal
        open={modalOpen}
        onClose={onClosedModal}
        machine={machine}
        portName={selectedPortName}
      />
    </React.Fragment>
  );
};

export default WorkspaceCreator;
