import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.grey.A400,
    padding: theme.spacing(1),
    color: 'white',
  },
}));

export default useStyles;
