import { FormControl, Typography, Fab, Grid } from '@material-ui/core';
import {faPlug, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';
import {IHaveWorkspace} from './types';
import {useOpenWorkspaceMutation} from '../../api/graphql';
import {AlertList, AlertMessageList, sanitizeAlertMessages} from '@openworkshop/ui/components/Alerts';

const OpenWorkspaceButton: React.FunctionComponent<IHaveWorkspace> = (props) => {
  const log = useLogger(OpenWorkspaceButton);
  const { t } = useTranslation();
  const { workspace } = props;
  const variables = { workspaceId: workspace.id };
  const [openWorkspace, openWorkspaceResult] = useOpenWorkspaceMutation({ variables });
  const errors: AlertMessageList =
    sanitizeAlertMessages([openWorkspaceResult?.error, openWorkspaceResult.data?.workspace.error]);
  const classes = useStyles();
  const isConnected = false;
  const isConnecting = false;
  const canConnect = true;
  const isDisabled = false;

  async function onPressConnect() {
    log.debug('connect');
    try {
      await openWorkspace();
    } catch (e) {
      log.error(e, 'connection error');
    }
  }


  log.debug('errors', errors, openWorkspaceResult.data);

  function onPressCancel() {
    log.debug('cancel');
  }

  function onPressDisconnect() {
    log.debug('disconnect');
  }

  log.verbose('open workspace', openWorkspace, openWorkspaceResult);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {!isConnected && <FormControl
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
        </FormControl>}
        {isConnected && <FormControl
          className={classes.formControl}
        >
          <Fab
            color='secondary'
            type='submit'
            variant='extended'
            size='large'
            onClick={onPressDisconnect}
            className={classes.connectionButton}
          >
            <FontAwesomeIcon className={classes.connectIcon} icon={faPowerOff} />
            <Typography variant="h6"><Trans>Disconnect</Trans></Typography>
          </Fab>
        </FormControl>}
      </Grid>
      {errors.length > 0 && <Grid item xs={12}>
        <AlertList errors={errors} />
      </Grid>}
    </Grid>
  );
};

export default OpenWorkspaceButton;
