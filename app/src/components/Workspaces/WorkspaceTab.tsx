import {FormControl, FormControlLabel, Grid, Checkbox, useTheme, DialogTitle } from '@material-ui/core';
import * as React from 'react';
import useStyles from './Styles';
import {IHaveWorkspace} from './types';
import {useMakerverseTrans} from '../../providers';
import { Button, Dialog, DialogActions, DialogContentText, DialogContent } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { useDeleteWorkspaceMutation } from 'api/graphql';
import {Redirect} from 'react-router-dom';
import {AlertList, IAlertMessage} from '@openworkshop/ui/components/Alerts';
import HelpfulHeader from '@openworkshop/ui/components/Text/HelpfulHeader';

type Props = IHaveWorkspace;

const WorkspaceTab: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const log = useLogger(WorkspaceTab);
  const classes = useStyles();
  const { workspace } = props;
  const [preferImperial, setPreferImperial] = React.useState(workspace.isImperialUnits);
  const [autoReconnect, setAutoReconnect] = React.useState(workspace.autoReconnect);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteWorkspace, deletedWorkspace] = useDeleteWorkspaceMutation();
  const [error, setError] = React.useState<IAlertMessage>();

  async function onAcceptDeleteWorkspace() {
    log.debug('delete', workspace);
    setDeleteDialogOpen(false);
    try {
      const variables = { workspaceId: workspace.id };
      await deleteWorkspace({ variables });
    } catch (e) {
      log.error(e, 'Deleting workspace');
      setError(e);
    }
  }

  if (deletedWorkspace && deletedWorkspace.data) {
    log.debug('deleted', deletedWorkspace);
    return <Redirect to="/workspaces" />;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <AlertList errors={[error, deletedWorkspace?.error]} />
      </Grid>
      <Grid item xs={12} md={8}>
        <HelpfulHeader
          tip={t('Makerverse stores the settings file at $HOME/.makerverse.')}
          title={t('Preferences')}
          variant="subtitle1"
        />
        <FormControl className={classes.formControl}>
          <FormControlLabel
            control={<Checkbox checked={preferImperial} onChange={() => setPreferImperial(!preferImperial)} />}
            label={t('I prefer imperial (inches) to metric (mm)')}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <FormControlLabel
            control={<Checkbox checked={autoReconnect} onChange={() => setAutoReconnect(!autoReconnect)} />}
            label={t('Automatically (re)connect to the machine when the workspace is opened.')}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4}>
        <HelpfulHeader
          tip={t('Workspaces grant access to your machine!')}
          title={t('Danger Zone')}
          variant="subtitle1"
        />
        <FormControl className={classes.formControl}>
          <Button className={classes.deleteButton} onClick={() => setDeleteDialogOpen(true)} >
            <FontAwesomeIcon icon={faTrash} />
            &nbsp;
            {t('Delete Workspace')}
          </Button>
        </FormControl>
      </Grid>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('Delete Workspace?')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Are you sure? This cannot be undone!')}
            <br /><br />
            {t('Most operational parameters (e.g., calibration) are stored on-device and are not affected by workspace deletion.')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('No')}</Button>
          <Button onClick={onAcceptDeleteWorkspace} autoFocus>{t('Yes')}</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default WorkspaceTab;
