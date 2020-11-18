import { Theme } from '@material-ui/core';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';

export const backgroundColor = '#f8f8f8';
export const headerColor = '#283a83';

export const headerBar = (theme: Theme): CreateCSSProperties => ({
  backgroundColor: headerColor,
  color: theme.palette.secondary.contrastText,
  fontWeight: 'bold',
});
