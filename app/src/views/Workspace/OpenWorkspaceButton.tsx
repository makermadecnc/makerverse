import {Fab, FormControl, Grid, Typography} from '@material-ui/core';
import {faPlug} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IHaveWorkspace} from '@openworkshop/ui/open-controller/Workspaces/types';
import {useOpenWorkspaceMutation, WorkspaceState} from '@openworkshop/lib/api/graphql';
import {AlertList, AlertMessageList, sanitizeAlertMessages} from '@openworkshop/ui/components/Alerts';
import {useTrans} from '@openworkshop/ui/open-controller/Context';

const OpenWorkspaceButton: React.FunctionComponent<IHaveWorkspace> = (props) => {
  const log = useLogger(OpenWorkspaceButton);
  const t = useTrans();
  const { workspace } = props;
  const variables = { workspaceId: workspace.id };
  const [openWorkspace, openWorkspaceResult] = useOpenWorkspaceMutation({ variables });
  const errors:  AlertMessageList =
    sanitizeAlertMessages([openWorkspaceResult?.error, openWorkspaceResult.data?.workspace.error]);
  const classes = useStyles();
  const isConnecting = openWorkspaceResult.loading ?? false;
  const canConnect = [WorkspaceState.Closed, WorkspaceState.Error].includes(workspace.state) && !isConnecting;
  const isDisabled = !canConnect;

  async function onPressConnect() {
    log.debug('connect');
    try {
      await openWorkspace();
    } catch (e) {
      log.error(e, 'connection error');
    }
  }


  function onPressCancel() {
    log.debug('cancel');
  }

  function onPressDisconnect() {
    log.debug('disconnect');
  }

  log.verbose('open workspace', openWorkspace, openWorkspaceResult);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><FormControl
        className={classes.formControl}
      >
        <Fab
          color='primary'
          type='submit'
          variant='extended'
          size='large'
          onClick={canConnect ? onPressConnect : onPressCancel}
          className={classes.connectionButton}
          disabled={isDisabled}
        >
          <FontAwesomeIcon className={classes.connectIcon} icon={faPlug} />
          <Typography variant="h6">{isConnecting ? t('Cancel') : t('Connect')}</Typography>
        </Fab>
      </FormControl>
      </Grid>
      {errors.length > 0 && <Grid item xs={12}>
        <AlertList errors={errors} />
      </Grid>}
    </Grid>
  );
};

export default OpenWorkspaceButton;
