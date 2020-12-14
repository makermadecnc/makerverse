import { makeStyles, Theme } from '@material-ui/core/styles';

export const barSize = 44;
const tabSize = 44;

const maxWidth = 320;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(2),
    marginTop: 80,
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
  actionButton: {
    position: 'fixed',
    top: 110,
    right: theme.spacing(1),
    padding: 0,
    backgroundColor: theme.palette.background.paper,
  },
  toolBar: {
    // height: controlBarHeight,
    // position: 'fixed',
    padding: theme.spacing(0),
    // margin: theme.spacing(2),
    position: 'fixed',
    // bottom: 0,
    right: theme.spacing(1),
  },
  toolBarSide: {
    top: 168,
    maxWidth: maxWidth, // Make space for right column, but keep ToolPane the same size.
  },
  toolBarBottom: {
    bottom: theme.spacing(1),
    maxWidth: maxWidth,
  },
  toolPaper: {
    padding: theme.spacing(0),
    maxHeight: '50vh',
    // maxWidth: maxWidth * 10 / 12,
    // display: 'flex',
  },
  tabs: {
    width: '100%',
  },
  tabSide: {
    padding: 0,
    width: '100%',
    height: barSize,
  },
  tabBottom: {
    maxHeight: tabSize,
    minHeight: tabSize,
    width: '100%',
  },
  visualizer: {
    height: `calc(100vh - ${barSize + 60}px)`,
  }
}));

export default useStyles;
