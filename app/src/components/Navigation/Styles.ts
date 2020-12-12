import { makeStyles, Theme } from '@material-ui/core/styles';

export const drawerWidthSm = 50;
export const drawerWidthLg = 240;

const bkColor = '#dfdfdf';
const drawerBreakpoint = 'sm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
  },
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
    maxWidth: 48,
    maxHeight: 48,
  },
  headerTitle: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
    marginLeft: 0,
    color: theme.palette.secondary.contrastText,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    // Open: icons-only on small screens, icons+text on large screens.
    width: drawerWidthSm,
    backgroundColor: bkColor,
    [theme.breakpoints.up(drawerBreakpoint)]: {
      width: drawerWidthLg,
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    // Closed: invisible on small screens, icons-only on large screens.
    width: 0,
    [theme.breakpoints.up(drawerBreakpoint)]: {
      width: drawerWidthSm,
    },
    backgroundColor: bkColor,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
  },
  toolbar: {
    ...theme.mixins.toolbar,
    backgroundColor: undefined,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
  },
}));

export default useStyles;
