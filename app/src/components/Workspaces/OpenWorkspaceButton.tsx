import { FormControl, Typography, Fab } from '@material-ui/core';
import {faPlug, faPowerOff} from '@fortawesome/free-solid-svg-icons';
import * as React from 'react';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';
import {IHaveWorkspace} from './types';

const OpenWorkspaceButton: React.FunctionComponent<IHaveWorkspace> = (props) => {
  const log = useLogger(OpenWorkspaceButton);
  const { t } = useTranslation();
  const classes = useStyles();
  const isConnected = false;
  const isConnecting = false;
  const canConnect = true;
  const isDisabled = false;

  function onPressConnect() {
    log.debug('connect');
  }

  function onPressCancel() {
    log.debug('cancel');
  }

  function onPressDisconnect() {
    log.debug('disconnect');
  }

  return (
    <FormControl className={classes.formControl}>

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
    </FormControl>
  );
};

export default OpenWorkspaceButton;
