import { Dialog, Toolbar, DialogTitle, DialogContent, DialogActions, Tabs, Tab} from '@material-ui/core';
import * as React from 'react';
import useStyles from './Styles';
import {IHaveWorkspace, IWorkspaceSettingsTab} from './types';
import {useMakerverseTrans} from '../../providers';
import {TabContext, TabList, TabPanel } from '@material-ui/lab';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import AxesTab from './AxesTab';
import WorkspaceTab from './WorkspaceTab';
import {ComponentType} from 'react';
import PartsTab from './PartsTab';

type Props = IHaveWorkspace & {
  open: boolean;
  onClose: () => void;
};

const WorkspaceSettingsDialog: React.FunctionComponent<Props> = (props) => {
  const t = useMakerverseTrans();
  const log = useLogger(WorkspaceSettingsDialog);
  const { open, onClose, workspace } = props;
  const classes = useStyles();
  const scroll = 'paper';
  const title = t('Settings');
  const [selectedTab, setSelectedTab] = React.useState('workspace');

  const tabs: IWorkspaceSettingsTab[] = [
    {
      key: 'workspace',
      title: t('Workspace'),
      component: <WorkspaceTab workspace={workspace} />
    },
    {
      key: 'axes',
      title: t('Axes'),
      component: <AxesTab workspace={workspace} />
    },
    {
      key: 'parts',
      title: t('Parts'),
      component: <PartsTab />
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby={title}
      className={classes.dialog}
    >
      <TabContext value={selectedTab}>
        <DialogTitle className={classes.dialogHeader}>
          <Toolbar>
            {title}
          </Toolbar>
        </DialogTitle>
        <TabList onChange={(e, val) => setSelectedTab(val)}>
          {tabs.map((tab) => {
            return <Tab key={tab.key} value={tab.key} label={tab.title} />;
          })}
        </TabList>
        <DialogContent className={classes.dialogContent}>
          {tabs.map((tab) => {
            return <TabPanel key={tab.key} value={tab.key} >
              {tab.component}
            </TabPanel>;
          })}
        </DialogContent>
      </TabContext>
    </Dialog>
  );
};

export default  WorkspaceSettingsDialog;
