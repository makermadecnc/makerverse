import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  header: {
    marginBottom: theme.spacing(2),
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
