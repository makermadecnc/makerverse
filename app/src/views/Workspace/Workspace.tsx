import * as React from 'react';
import { useTrans} from '@openworkshop/ui/open-controller/Context';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ToolBar from './ToolBar';
import { Tooltip, Fab, useTheme } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStyles from './Styles';
import {IHaveWorkspace} from '@openworkshop/ui/open-controller/Workspaces';
import {IHavePortStatus} from '@openworkshop/ui/open-controller/Ports';
import WorkspaceBar from './WorkspaceBar';
import GWiz from '@openworkshop/ui/open-controller/GWiz';
import GcodeVisualizerProvider from '@openworkshop/ui/open-controller/GWiz/GcodeVisualizerProvider';
import {useParams} from 'react-router-dom';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';

type Props = IHaveWorkspace & IHavePortStatus;

interface IParams {
  selectedToolGroupId?: string;
}

const Workspace: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(Workspace);
  const t = useTrans();
  const { workspace, port } = props;
  const theme = useTheme();
  const classes = useStyles();
  const params = useParams<IParams>();
  const { selectedToolGroupId } = params;

  log.verbose('workspace params', params);

  return (
    <GcodeVisualizerProvider >
      <WorkspaceBar workspace={workspace} port={port} >
        <GWiz className={classes.visualizer} >
          <Tooltip title={t('Halt the machine immediately (emergency stop) and re-set the connection.')}>
            <Fab className={classes.actionButton} size="medium" >
              <FontAwesomeIcon icon={faExclamationCircle} size={'lg'} color={theme.palette.error.dark} />
            </Fab>
          </Tooltip>
          <ToolBar workspace={workspace} selectedToolGroupId={selectedToolGroupId} />
        </GWiz>
      </WorkspaceBar>
    </GcodeVisualizerProvider>
  );
};

export default Workspace;
