import { makeStyles, Theme } from '@material-ui/core/styles';
import CardStyles from '@openworkshop/ui/components/Cards/CardStyles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
  },
  titleBar: {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.divider,
    borderBottomStyle: 'solid',
    padding: theme.spacing(0.5),
    textAlign: 'left',
    verticalAlign: 'middle',
  },
  machinePosition: {
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  titleBarCenter: {
    flexGrow: 1,
    verticalAlign: 'middle',
    paddingTop: 1,
    color: theme.palette.grey.A700,
    display: 'inline-block',
  },
  titleBarButtonGroup: {
    marginRight: theme.spacing(0.5),
  },
  titleBarButton: {
    padding: 0,
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  selectIcon: {
    height: 24,
    width: 24,
    marginBottom: 0,
    marginRight: theme.spacing(1),
  },
  selectMenuItem: {
    height: 24,
  },
  selectMenu: {
    height: 24,
  },
  dialogHeader: {
    padding: 0,
  },
  dialogContent: {
    padding: theme.spacing(2),
  },
  dialogFooter: {
    justifyContent: 'center',
    margin: 0,
    backgroundColor: theme.palette.grey.A100,
  }
}));

export default useStyles;
