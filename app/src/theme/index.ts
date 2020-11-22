import { createMuiTheme } from '@material-ui/core/styles';
import Colors from '@openworkshop/ui/themes/Colors';
import themeBase from '@openworkshop/ui/themes';
import 'typeface-roboto';
import 'typeface-cabin';

const theme = createMuiTheme({
  ...themeBase,
  palette: {
    ...themeBase.palette,
    primary: Colors.blue,
  },
  mixins: {
    ...themeBase.mixins,
    toolbar: {
      ...themeBase.mixins.toolbar,
      backgroundImage: undefined,
      backgroundColor: Colors.blue.main,
      color: Colors.blue.contrastText,
    }
  }
});

export default theme;
