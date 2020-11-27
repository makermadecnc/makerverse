import { Typography } from '@material-ui/core';
import {ICustomizedMachine} from '@openworkshop/lib/api/Machines/CustomizedMachine';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import CustomizeMachine from '@openworkshop/ui/components/MachineProfiles/CustomizeMachine';
import React, { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import OpenMachinePort from '../../components/Ports/OpenMachinePort';
import useStyles from './Styles';

const WorkspaceCreator: FunctionComponent = () => {
  const log = useLogger(WorkspaceCreator);
  const classes = useStyles();
  const { t } = useTranslation();
  const [machine, setMachine] = React.useState<ICustomizedMachine | undefined>(undefined);

  function onCustomized(cust?: ICustomizedMachine) {
    log.trace(cust);
    setMachine(cust);
  }

  return (
    <React.Fragment>
      <Typography variant="h5" className={classes.header}>
        <Trans>Create Workspace</Trans>
      </Typography>
      <CustomizeMachine
        tip={t('Select a machine, above, so that you may connect to it.')}
        onCustomized={onCustomized}
      />
      {machine && <OpenMachinePort machine={machine} />}
    </React.Fragment>
  );
};

export default WorkspaceCreator;
