import { ButtonGroup, Button, Paper, Grid } from '@material-ui/core';
import * as React from 'react';
import {IHaveWorkspace} from 'components/Workspaces';
import useStyles from './Styles';
import clsx from 'clsx';
import { Typography } from '@material-ui/core';
import {ToolType, Console, WorkspaceSettings, Plans, Controls, Machine} from '../../components/Tools';
import {MicrochipIcon,TerminalIcon, ControlPadIcon, BlueprintIcon} from '@openworkshop/ui/components/OpenWorkShopIcon';
import {useMakerverseTrans, useWindowSize} from '../../providers';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';

type Props = IHaveWorkspace;

const ToolBar: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(ToolBar);
  const classes = useStyles();
  const t = useMakerverseTrans();
  const { workspace } = props;
  const [selectedToolType, setSelectedToolType] = React.useState<ToolType>(ToolType.None);
  const toolNumbers = [...Array(ToolType.NumTools).keys()];
  const windowSize = useWindowSize();
  const isOnBottom = windowSize.width < windowSize.height;

  function getToolTypeTitle(tt: ToolType): string {
    if (tt === ToolType.Machine) return t('Machine');
    if (tt === ToolType.Controls) return t('Controls');
    if (tt === ToolType.Plans) return t('Plans');
    if (tt === ToolType.Console) return t('Console');
    if (tt === ToolType.Workspace) return t('Workspace');
    return '?';
  }

  function getToolTypeIcon(tt: ToolType): React.ReactNode {
    if (tt === ToolType.Machine) return <MicrochipIcon />;
    if (tt === ToolType.Controls) return <ControlPadIcon />;
    if (tt === ToolType.Plans) return <BlueprintIcon />;
    if (tt === ToolType.Console) return <TerminalIcon />;
    if (tt === ToolType.Workspace) return <OpenWorkShopIcon name={workspace.icon} />;
    return null;
  }

  function getToolComponent(tt: ToolType): React.ReactNode {
    if (tt === ToolType.Machine) return <Machine workspace={workspace} />;
    if (tt === ToolType.Controls) return <Controls workspace={workspace} />;
    if (tt === ToolType.Plans) return <Plans workspace={workspace} />;
    if (tt === ToolType.Console) return <Console workspace={workspace} />;
    if (tt === ToolType.Workspace) return <WorkspaceSettings workspace={workspace} />;
    return null;
  }

  function getToolContent(tt: ToolType): React.ReactNode {
    if (tt === ToolType.None || tt === ToolType.NumTools) return null;
    return (
      <Paper className={classes.toolPaper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" color="primary">
              {getToolTypeTitle(tt)}
            </Typography>
          </Grid>
          {getToolComponent(tt)}
        </Grid>
      </Paper>
    );
  }

  function onSelectTab(tt: ToolType): void {
    const toolType = tt === selectedToolType ? ToolType.None : tt;
    log.debug('Tool type', toolType);
    setSelectedToolType(toolType);
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
      <Grid item xs={isOnBottom ? 12 : 9}>
        {getToolContent(selectedToolType)}
      </Grid>
      <Grid item xs={isOnBottom ? 12 : 3}>
        <Paper className={classes.toolBarPaper} >
          <ButtonGroup
            orientation={isOnBottom ? 'horizontal' : 'vertical'}
            aria-label={t('Toolbar Tabs')}
          >
            {toolNumbers.map(tt => {
              return (
                <Button
                  key={getToolTypeTitle(tt)}
                  className={clsx({ [classes.tabSide]: !isOnBottom, [classes.tabBottom]: isOnBottom })}
                  color={tt === selectedToolType ? 'secondary' : 'primary'}
                  onClick={() => onSelectTab(tt)}
                  aria-label={getToolTypeTitle(tt)}
                >
                  {getToolTypeIcon(tt)}
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
