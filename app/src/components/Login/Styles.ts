import { makeStyles, Theme } from '@material-ui/core/styles';
// import { cardFooter } from '@openworkshop/ui/components/Cards/CardStyles';

const useStyles = makeStyles((theme: Theme) => ({
  cardHeader: {
    padding: 0,
  },
  // cardFooter: cardFooter(theme),
  root: {
    margin: theme.spacing(4),
    minWidth: 300,
  },
  content: {
    padding: theme.spacing(4),
  },
  form: {},
  actionButton: {
    padding: theme.spacing(4),
  },
  centered: {
    textAlign: 'center',
    verticalAlign: 'center',
  },
  socialButtons: {
    justifyContent: 'center',
  },
  logo1: {
    maxWidth: '64px',
    marginRight: '30px',
  },
  logo2: {
    maxWidth: '64px',
    marginLeft: '30px',
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
    marginRight: theme.spacing(2),
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
