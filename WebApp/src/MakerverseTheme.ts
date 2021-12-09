import makerHubTheme from '@openworkshop/maker-hub/themes';
import { createTheme, SimplePaletteColorOptions } from '@mui/material/styles';
import Colors from '@openworkshop/maker-hub/themes/Colors';

export const makerverseColors = {
  navy: '#06456C',
  deepBlue: '#00639B',
  makerBlue: '#0076B3',
  seaBlue: '#3B9ECA',
  skyBlue: '#99D8EB',
  barelyBlue: '#EAF0F3',

  citrus: '#FFCA06',
  makerYellow: '#FFD900',
  lemon: '#FFDC00',

  tangerine: '#E17525',
  makerOrange: '#F8916D',
  creamcicle: '#FDBF63',

  lime: '#63A844',
  makerGreen: '#78BE43',
  kiwi: '#A4CF60',
};

export const makerBlues: SimplePaletteColorOptions = {
  light: makerverseColors.skyBlue,
  main: makerverseColors.makerBlue,
  dark: makerverseColors.navy,
  contrastText: '#fff',
};

export const makerYellows: SimplePaletteColorOptions = {
  light: makerverseColors.lemon,
  main: makerverseColors.makerYellow,
  dark: makerverseColors.citrus,
  contrastText: '#fff',
};

export const makerOranges: SimplePaletteColorOptions = {
  light: makerverseColors.creamcicle,
  main: makerverseColors.makerOrange,
  dark: makerverseColors.tangerine,
  contrastText: '#fff',
};

export const makerGreens: SimplePaletteColorOptions = {
  light: makerverseColors.kiwi,
  main: makerverseColors.makerGreen,
  dark: makerverseColors.lime,
  contrastText: '#fff',
};

const makerverseTheme = createTheme({
  ...makerHubTheme,
  palette: {
    primary: makerGreens,
    secondary: makerBlues,
    info: makerOranges,
    background: {
      paper: '#fff',
      default: makerverseColors.barelyBlue,
    },
  },
  mixins: {
    ...makerHubTheme.mixins,
    toolbar: {
      ...makerHubTheme.mixins.toolbar,
      backgroundImage: undefined,
      backgroundColor: makerverseColors.seaBlue,
      color: Colors.blue.contrastText,
    },
  },
});

export default makerverseTheme;
