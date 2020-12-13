import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(2),
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
    margin: theme.spacing(1),
  },
  leftButtonIconAdornment: {
    marginRight: theme.spacing(2),
  }
}));

export default useStyles;
