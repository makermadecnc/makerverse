import { makeStyles, Theme } from '@material-ui/core/styles';

const barSize = 74;
const tabSize = 44;
const tabWidth = 320 / 6;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginTop: barSize,
  },
  paper: {
    padding: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
    width: '100%',
    margin: theme.spacing(1),
  },
  connectionButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  connectIcon: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(1),
  },
  toolBarPaper: {
    // display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  toolBar: {
    // height: controlBarHeight,
    // position: 'fixed',
    padding: theme.spacing(0),
    // margin: theme.spacing(2),
    position: 'fixed',
    maxWidth: 320,
    // bottom: 0,
    right: theme.spacing(1),
  },
  toolBarSide: {
    top: 80,
  },
  toolBarBottom: {
    bottom: theme.spacing(1),
  },
  toolPaper: {
    padding: theme.spacing(1),
    // display: 'flex',
  },
  tabSide: {
    maxWidth: barSize,
    minWidth: barSize,
  },
  tabBottom: {
    maxHeight: tabSize,
    minHeight: tabSize,
    maxWidth: tabWidth,
    minWidth: tabWidth,
  },
}));

export default useStyles;
