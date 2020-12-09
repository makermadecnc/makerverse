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
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faProjectDiagram, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faUsb } from '@fortawesome/free-brands-svg-icons';
import { useTranslation } from 'react-i18next';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {PortStatusFragment} from '../../api/graphql';
import {MakerverseContext} from '../../lib/Makerverse';
import ListMenuItem from './ListMenuItem';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import WorkspaceStatus from '../Workspaces/WorkspaceStatus';

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
  const ports = useSystemPorts();
  const portList: PortStatusFragment[] = Object.values(ports.portMap);
  const { t } = useTranslation();
  const classes = useStyles();
  const makerverse = React.useContext(MakerverseContext);
  const workspaces = _.sortBy(makerverse.workspaces, ws => ws.name.toLowerCase());
  const showWorkspaces = makerverse.workspaces.length > 0;
  const iconStyle = { width: 24, height: 24, marginLeft: -2 };

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
          {workspaces.map((workspace) => {
            const route = `/workspaces/${workspace.id}`;
            const icon = <OpenWorkShopIcon style={iconStyle} name={workspace.icon ?? 'xyz'} />;
            const port = portList.length > 0 ?
              _.find(portList, p => p.portName === workspace.connection.portName) : undefined;

            return <ListMenuItem
              key={workspace.id}
              to={route}
              title={workspace.name}
              icon={icon}
              subcomponent={<WorkspaceStatus workspace={workspace} port={port} />}
            />;
          })}
        </List>
        <Divider />
      </React.Fragment>}
      <List>
        {renderRouteItem('/home', makerverse.t('Projects'), faProjectDiagram, makerverse.t('MakerHub'))}
        {renderRouteItem('/workspaces', makerverse.t('Connect'), faUsb, makerverse.t('Create a Workspace'))}
        {renderRouteItem('/settings', makerverse.t('Settings'), faCogs, makerverse.t('& Useful Information'))}
        {renderRouteItem('/docs', makerverse.t('Documentation'), faQuestionCircle, makerverse.t('& Support Requests'))}
      </List>
    </div>
  );
};

export default ListMenu;
