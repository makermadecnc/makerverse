import { Dialog, Toolbar, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import * as React from 'react';
import useStyles from './Styles';
import {IHaveWorkspace} from './types';
import {useMakerverseTrans} from '../../providers';

type Props = IHaveWorkspace & {
  open: boolean;
  onClose: () => void;
};

const WorkspaceSettingsDialog: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const { open, onClose } = props;
  const classes = useStyles();
  const scroll = 'body';
  const title = t('Workspace Settings');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby={title}
    >
      <DialogTitle className={classes.dialogHeader}>
        <Toolbar>
          {title}
        </Toolbar>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
      </DialogContent>
      <DialogActions className={classes.dialogFooter}>aoeu</DialogActions>
    </Dialog>
  );
};

export default  WorkspaceSettingsDialog;
