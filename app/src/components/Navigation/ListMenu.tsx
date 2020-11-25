import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { OpenWorkShopIcon } from '@openworkshop/ui/components';
import React, { FunctionComponent } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Divider,
  List,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faHome, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {MakerverseContext} from '../../lib/Makerverse';
import ListMenuItem from './ListMenuItem';

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
  const makerverse = React.useContext(MakerverseContext);
  const showWorkspaces = makerverse.workspaces.length > 0;
  const iconStyle = { width: 24, height: 24, marginLeft: -2 };

  function renderRouteItem(route: string, text: string, icon: IconProp, t2?: string) {
    const i = <FontAwesomeIcon size='lg' style={iconStyle} icon={icon} />;
    return <ListMenuItem to={route} title={text} icon={i} subtitle={t2} />;
  }

  return (
    <div>
      <div className={classes.toolbar} />
      {showWorkspaces && <React.Fragment>
        <Divider />
        <List>
          {makerverse.workspaces.map((workspace) => {
            const route = `/workspaces/${workspace.id}`;
            const icon = <OpenWorkShopIcon style={iconStyle} name={workspace.icon ?? 'xyz'} />;

            return <ListMenuItem key={workspace.id} to={route} title={workspace.name} icon={icon} />;
          })}
        </List>
        <Divider />
      </React.Fragment>}
      <List>
        {renderRouteItem('/home', t('Home'), faHome)}
        {renderRouteItem('/workspaces', t('Connect'), faUsb)}
        {renderRouteItem('/settings', t('Settings'), faCogs)}
        {renderRouteItem('/docs', t('Documentation'), faQuestionCircle)}
      </List>
    </div>
  );
};

export default ListMenu;
