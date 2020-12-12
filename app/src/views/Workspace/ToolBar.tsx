import _ from 'lodash';
import { ButtonGroup, Button, Paper, Grid } from '@material-ui/core';
import * as React from 'react';
import {IHaveWorkspace} from 'components/Workspaces';
import useStyles from './Styles';
import clsx from 'clsx';
import {useMakerverseTrans, useWindowSize} from '../../providers';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import ToolPane from './ToolPane';

type Props = IHaveWorkspace;

const ToolBar: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(ToolBar);
  const classes = useStyles();
  const t = useMakerverseTrans();
  const { workspace } = props;
  const [selectedToolId, setSelectedToolId] = React.useState<string | undefined>(undefined);
  const selectedTool = selectedToolId ? _.find(workspace.tools, t => t.id === selectedToolId) : undefined;
  const windowSize = useWindowSize();
  const isOnBottom = windowSize.width < windowSize.height;

  function onSelectedToolId(id: string): void {
    const toolId = id === selectedToolId ? undefined : id;
    log.debug('[TOOL]', toolId);
    setSelectedToolId(toolId);
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
        {selectedTool && <ToolPane toolGroup={selectedTool} workspace={workspace} />}
      </Grid>
      <Grid item xs={isOnBottom ? 12 : 2}>
        <Paper className={classes.toolBarPaper} >
          <ButtonGroup
            className={classes.tabs}
            orientation={isOnBottom ? 'horizontal' : 'vertical'}
            aria-label={t('Toolbar Tabs')}
          >
            {workspace.tools.map(tool => {
              return (
                <Button
                  key={tool.titleKey}
                  className={clsx({ [classes.tabSide]: !isOnBottom, [classes.tabBottom]: isOnBottom })}
                  color={tool.titleKey === selectedToolId ? 'secondary' : 'primary'}
                  onClick={() => onSelectedToolId(tool.id)}
                  aria-label={tool.titleKey}
                >
                  <OpenWorkShopIcon name={tool.icon} />
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
