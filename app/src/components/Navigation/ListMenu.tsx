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
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {PortStatusFragment} from '@openworkshop/lib/api/graphql';
import ListMenuItem from './ListMenuItem';
import {useSystemPorts} from '@openworkshop/ui/open-controller/Ports';
import {Workspace, WorkspaceStatus} from '@openworkshop/ui/open-controller/Workspaces/';
import {useOpenController, useTrans} from '@openworkshop/ui/open-controller/Context';

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
  const t = useTrans();
  const portList: PortStatusFragment[] = Object.values(ports.portMap);
  const classes = useStyles();
  const makerverse = useOpenController();
  const workspaces: Workspace[] = _.sortBy(makerverse.workspaces, ws => ws.name.toLowerCase());
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
        {renderRouteItem('/home', t('Projects'), faProjectDiagram, t('MakerHub'))}
        {renderRouteItem('/workspaces', t('Connect'), faUsb, t('Create a Workspace'))}
        {renderRouteItem('/settings', t('Settings'), faCogs, t('& Useful Information'))}
        {renderRouteItem('/docs', t('Documentation'), faQuestionCircle, t('& Support Requests'))}
      </List>
    </div>
  );
};

export default ListMenu;
