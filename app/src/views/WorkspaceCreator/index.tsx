import { Typography } from '@material-ui/core';
import {ICustomizedMachine} from '@openworkshop/lib/api/Machines/CustomizedMachine';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import CustomizeMachine from '@openworkshop/ui/components/MachineProfiles/CustomizeMachine';
import React, { FunctionComponent } from 'react';
import { Trans } from 'react-i18next';
import {useMonitorPortsSubscription} from '../../api/graphql';
import useStyles from './Styles';

const WorkspaceCreator: FunctionComponent = () => {
  const log = useLogger(WorkspaceCreator);
  const classes = useStyles();
  const [machine, setMachine] = React.useState<ICustomizedMachine | undefined>(undefined);

  const sub = useMonitorPortsSubscription();
  log.debug('subscription', sub);

  function onCustomized (cust?: ICustomizedMachine) {
    log.trace(cust);
    setMachine(cust);
  }

  return (
    <React.Fragment>
      <Typography variant="h5" className={classes.header}>
        <Trans>Create Workspace</Trans>
      </Typography>
      <CustomizeMachine onCustomized={onCustomized} />
    </React.Fragment>
  );
};

export default WorkspaceCreator;
