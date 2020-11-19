import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { OpenWorkShopIcon } from '@openworkshop/ui/components';
import React, { FunctionComponent } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import Workspaces from 'lib/workspaces';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

interface OwnProps {
  isPermanent: boolean;
}

type Props = OwnProps;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
  }),
);

const ListMenu: FunctionComponent<Props> = (props) => {
  const log = useLogger(ListMenu);
  const { t } = useTranslation();
  const classes = useStyles();
  const workspaceIds = Object.keys(Workspaces.all);
  const iconStyle = { width: 24, height: 24, marginLeft: -2 };

  // function getSecondary(text: string): React.ReactNode {
  //   return <Typography variant="subtitle2">{text}</Typography>;
  // }

  function handleSelectWorkspaceId(id: string): void {
    log.debug('select workspace ID', id);
  }

  function handleRoute(path: string): void {
    log.debug('select path', path);
  }

  function isRouteActive(route: string) {
    return location.pathname === route;
  }

  function renderItem(route: string, text: string, icon: React.ReactNode, t2?: string) {
    const s = t2 ? <Typography variant='subtitle2'>{t2}</Typography> : null;
    const link = (p: unknown) => <Link to={route} {...p} />;
    return (
      <ListItem selected={isRouteActive(route)} button key={route} component={link}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={<Typography variant='h6'>{text}</Typography>} secondary={s} />
      </ListItem>
    );
  }

  function renderRouteItem(route: string, text: string, icon: IconProp, t2?: string) {
    const i = <FontAwesomeIcon size='lg' style={iconStyle} icon={icon} />;
    return renderItem(route, text, i, t2);
  }

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        {workspaceIds.map((workspaceId) => {
          const workspace = Workspaces.all[workspaceId];
          const route = `/workspaces/${workspace.id}`;
          const icon = <OpenWorkShopIcon style={iconStyle} name={workspace.icon} />;
          workspace.isActive = isRouteActive(route);
          log.info('icon', icon);

          return renderItem(route, workspace.name, icon);
        })}
      </List>
      <Divider />
      <List>
        {renderRouteItem('/home', t('Home'), faHome)}
        {renderRouteItem('/workspaces', t('Create Workspace'), faUsb)}
        {renderRouteItem('/settings', t('Settings'), faCogs)}
        {renderRouteItem('/docs', t('Documentation'), faQuestionCircle)}
      </List>
    </div>
  );
};

export default ListMenu;
