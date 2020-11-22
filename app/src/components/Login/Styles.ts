import { makeStyles, Theme } from '@material-ui/core/styles';
import { cardFooter } from '@openworkshop/ui/components/Cards/CardStyles';

const useStyles = makeStyles((theme: Theme) => ({
  cardHeader: {},
  cardFooter: cardFooter(theme),
  root: {
    margin: theme.spacing(4),
    minWidth: 300,
  },
  form: {},
  centered: {
    height: '100%',
    textAlign: 'center',
    justifyContent: 'center',
    verticalAlign: 'center',
  },
  socialButtons: {
    justifyContent: 'center',
  },
  submit: {
    paddingLeft: theme.spacing(3),
  },
  buttonIcon: {
    margin: theme.spacing(1),
  },
  input: {
    width: '100%',
  },
  inputIcon: {
    color: theme.palette.grey.A700,
    marginRight: 10,
  },
  top: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  bottom: {
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },
  page: {
    padding: 20,
  },
}));

export default useStyles;
