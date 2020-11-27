import _ from 'lodash';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import { OpenWorkShopIcon } from '@openworkshop/ui/components';
import React, { FunctionComponent } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Divider,
  List,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faProjectDiagram, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {useListPortsQuery} from '../../api/graphql';
import {MakerverseContext} from '../../lib/Makerverse';
import PortStatus from '../Ports/PortStatus';
import ListMenuItem from './ListMenuItem';

interface OwnProps {
  isOpen: boolean;
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

  const { data, loading, error } = useListPortsQuery();

  function renderRouteItem(route: string, text: string, icon: IconProp, t2?: string) {
    const i = <FontAwesomeIcon size='lg' style={iconStyle} icon={icon} />;
    const st = t2 ? <React.Fragment>{t2}</React.Fragment> : undefined;
    return <ListMenuItem to={route} title={text} icon={i} subcomponent={st} />;
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
            const port = data && data.ports ?
              _.find(data.ports, p => p.portName === workspace.connection.port) : undefined;

            return <ListMenuItem
              key={workspace.id}
              to={route}
              title={workspace.name}
              icon={icon}
              subcomponent={<PortStatus port={port} />}
            />;
          })}
        </List>
        <Divider />
      </React.Fragment>}
      <List>
        {renderRouteItem('/home', t('Projects'), faProjectDiagram, t('MakerHub'))}
        {renderRouteItem('/workspaces', t('Connect'), faUsb, t('Create a Workspace'))}
        {renderRouteItem('/settings', t('Settings'), faCogs, t('& Useful Information'))}
        {renderRouteItem('/docs', t('Documentation'), faQuestionCircle, t('& Support Requests'))}
      </List>
    </div>
  );
};

export default ListMenu;
