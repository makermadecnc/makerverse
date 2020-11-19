import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import settings from '../../config/settings';
import SideDrawer from './SideDrawer';
import useStyles from './Styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface OwnProps {
  toggleDrawerOpen: () => void;
}

type Props = OwnProps;

const HeaderBar: FunctionComponent<Props> = (props) => {
  const classes = useStyles();

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.headerBar}>
        <IconButton
          color='default'
          aria-label='open drawer'
          edge='start'
          onClick={() => props.toggleDrawerOpen()}
          className={classes.menuButton}>
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
        <Typography variant='h1' noWrap>
          {settings.productName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
