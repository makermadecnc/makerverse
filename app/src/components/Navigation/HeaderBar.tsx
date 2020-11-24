import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import settings from '../../config/settings';
import { MakerverseContext } from '../../lib/Makerverse';
import useStyles from './Styles';
import UserMenu from './UserMenu';

interface OwnProps {
  toggleDrawerOpen: () => void;
}

type Props = OwnProps;

const HeaderBar: FunctionComponent<Props> = (props) => {
  const log = useLogger(HeaderBar);
  const makerverse = React.useContext(MakerverseContext);
  const workspace = makerverse.workspaces.current;
  const classes = useStyles();

  const bk = workspace ? { backgroundColor: workspace.hexColor } : {};
  log.debug('workspace', workspace, bk);

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar} style={bk} >
        <IconButton
          aria-label='open drawer'
          edge='start'
          onClick={() => props.toggleDrawerOpen()}
          className={classes.menuButton}
        >
          <img
            src="/images/logos/makerverse.png"
            className={classes.sidebarIcon}
          />
        </IconButton>
        <Typography variant='h1' noWrap className={classes.headerTitle}>
          {settings.productName}
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
