import _ from 'lodash';
import { ButtonGroup, Button, Paper, Grid } from '@material-ui/core';
import * as React from 'react';
import {IHaveWorkspace} from '@openworkshop/ui/open-controller/Workspaces';
import useStyles from './Styles';
import clsx from 'clsx';
import {useTrans, useWindowSize} from '@openworkshop/ui/open-controller/Context';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import ToolPane from './ToolPane';
import {Route, Switch, useHistory} from 'react-router-dom';
import {IToolGroup} from '@openworkshop/ui/open-controller/Tools';

type Props = IHaveWorkspace & {
  selectedToolGroupId?: string;
}

const ToolBar: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(ToolBar);
  const classes = useStyles();
  const t = useTrans();
  const { workspace, selectedToolGroupId } = props;
  const history = useHistory();
  // const [selectedToolId, setSelectedToolId] = React.useState<string | undefined>(undefined);
  const windowSize = useWindowSize();
  const isOnBottom = windowSize.width < windowSize.height;
  const workspacePath = `/workspaces/${workspace.id}`;

  function getToolGroupPath(toolGroup: IToolGroup): string {
    return `${workspacePath}/${toolGroup.id}`;
  }

  function onSelectedToolGroup(toolGroup: IToolGroup): void {
    const toolGroupId = toolGroup.id === selectedToolGroupId ? undefined : toolGroup.id;
    log.debug('[TOOL]', selectedToolGroupId, '->', toolGroup.id, toolGroupId);
    // setSelectedToolId(toolId);
    history.push(`${workspacePath}/${toolGroupId ?? ''}`);
  }

  return (
    <Grid
      container
      direction={isOnBottom ? 'column' : 'row'}
      spacing={1}
      className={clsx(classes.toolBar, {
        [classes.toolBarSide]: !isOnBottom,
        [classes.toolBarBottom]: isOnBottom,
      })}
    >
      <Grid item xs={isOnBottom ? 12 : 10}>
        <Switch>
          {workspace.tools.map((toolGroup) => {
            return (
              <Route exact key={toolGroup.id} path={getToolGroupPath(toolGroup)} >
                <ToolPane toolGroup={toolGroup} workspace={workspace} />
              </Route>
            );
          })}
        </Switch>
      </Grid>
      <Grid item xs={isOnBottom ? 12 : 2}>
        <Paper className={classes.toolBarPaper} >
          <ButtonGroup
            className={classes.tabs}
            orientation={isOnBottom ? 'horizontal' : 'vertical'}
            aria-label={t('Toolbar Tabs')}
          >
            {workspace.tools.map(toolGroup => {
              return (
                <Button
                  key={toolGroup.titleKey}
                  className={clsx({ [classes.tabSide]: !isOnBottom, [classes.tabBottom]: isOnBottom })}
                  color={toolGroup.id === selectedToolGroupId ? 'secondary' : 'primary'}
                  onClick={() => onSelectedToolGroup(toolGroup)}
                  aria-label={toolGroup.titleKey}
                >
                  <OpenWorkShopIcon name={toolGroup.icon} />
                </Button>
              );
            })}
          </ButtonGroup>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ToolBar;
