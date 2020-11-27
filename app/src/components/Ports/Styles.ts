import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    minWidth: 120,
    width: '100%',
    margin: theme.spacing(1),
  },
  portSelectItem: {

  },
  portMenuIcon: {
    float: 'left',
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  connectButton: {
    marginTop: theme.spacing(2),
  },
  connectIcon: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(1),
  }
}));

export default useStyles;
