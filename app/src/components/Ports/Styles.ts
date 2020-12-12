import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  formControl: {
    minWidth: 120,
    width: '100%',
  },
  portSelectItem: {
    width: '100%',
  },
  portMenuIcon: {
    float: 'left',
    marginTop: theme.spacing(0.5),
    marginRight: theme.spacing(1),
  },
  connectionButton: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  connectIcon: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(1),
  }
}));

export default useStyles;
