import { makeStyles, Theme } from '@material-ui/core/styles';
import { headerBar } from '../../styles';

export const drawerWidthSm = 50;
export const drawerWidthLg = 240;
const drawerBreakpoint = 'sm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
  headerBar: headerBar(theme),
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidthSm,
    width: `calc(100% - ${drawerWidthSm}px)`,
    [theme.breakpoints.up(drawerBreakpoint)]: {
      marginLeft: drawerWidthLg,
      width: `calc(100% - ${drawerWidthLg}px)`,
    },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  sidebarIcon: {
    width: 48,
    height: 48,
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidthSm,
    [theme.breakpoints.up(drawerBreakpoint)]: {
      width: drawerWidthLg,
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
    [theme.breakpoints.up(drawerBreakpoint)]: {
      width: drawerWidthSm,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default useStyles;
