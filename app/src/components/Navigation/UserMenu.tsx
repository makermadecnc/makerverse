import {faShieldAlt, faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from '@material-ui/core';
import {Alert, IconButton, Menu, MenuItem } from '@material-ui/core';
import { OpenWorkShop } from '@openworkshop/lib';
import {useNetworkStatus} from '@openworkshop/lib/utils/device';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import React, { FunctionComponent } from 'react';
import {Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {MakerverseContext} from '../../lib/Makerverse';
// import {reconnectToBackend} from '../../lib/Makerverse/apollo';

const UserMenu: FunctionComponent = () => {
  const log = useLogger(UserMenu);
  const { t } = useTranslation();
  const { isOnline } = useNetworkStatus();
  const history = useHistory();
  const ows = React.useContext(OpenWorkShop);
  const makerverse = React.useContext(MakerverseContext);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { connection, session } = makerverse;
  const isAuthenticated = !!session;
  const isConnected = connection.isConnected;
  const showUserMenu = isOnline && isAuthenticated && isConnected;
  //
  // const handleAccountLink = (page: string) => {
  //   history.push(page);
  //   setAnchorEl(null);
  // };

  function getIcon() {
    if (!isConnected) {

    }
    if (!isOnline) {

    }
    if (!session) {
      return faUserSlash;
    }
    return faShieldAlt;
  }
  const icon = getIcon();

  function renderHeader() {
    if (!isConnected) {
      return <Alert severity="error">{t('Cannot communicate with Makerverse.')}</Alert>;
    }
    if (!isOnline) {
      return <Alert severity="warning">{t('You are offline.')}</Alert>;
    }
    if (!session) {
      return <Alert severity="warning">{t('You are not logged in. Community features will be unavailable.')}</Alert>;
    }
    return <Alert severity="info">{t('Welcome, {{ username }}', session.user)}</Alert>;
  }

  function renderVersion() {
    return 'Makerverse v?.?.?';
  }

  log.trace('online', isOnline, 'authenticated', isAuthenticated);

  return (
    <div>
      <IconButton
        aria-label='account of current user'
        aria-controls='menu-appbar'
        aria-haspopup='true'
        onClick={(e) => setAnchorEl(e.currentTarget)}
        color='inherit'
      >
        <FontAwesomeIcon icon={icon} />
      </IconButton>
      <Menu
        id='menu-appbar'
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <Typography variant="h6">
          {renderHeader()}
        </Typography>
        <Typography variant="subtitle1">
          {renderVersion()}
        </Typography>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setTimeout(() => void makerverse.connection.reconnect(), 10);
          }}>
          <Trans>Reconnect</Trans>
        </MenuItem>
        {isAuthenticated && <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setTimeout(() => void ows.authManager.signoutRedirect(), 10);
          }}>
          Logout
        </MenuItem>}
      </Menu>
    </div>
  );
};

export default UserMenu;
