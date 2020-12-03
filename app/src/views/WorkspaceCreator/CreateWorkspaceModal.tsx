import _ from 'lodash';
import { Typography, FormControl, InputLabel, Input, Grid, FormHelperText, FormControlLabel, Checkbox, Fab, useTheme } from '@material-ui/core';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import CardDialog from '@openworkshop/ui/components/Cards/CardDialog';
import useStyles from './Styles';
import useLogger from '@openworkshop/lib/utils/logging/UseLogger';
import analytics from 'lib/analytics';
import docs from '../../constants/docs';
import {ICustomizedMachine} from '@openworkshop/lib/api/Machines/CustomizedMachine';
import {slugify} from '@openworkshop/lib/utils';
import {useSystemPorts} from '../../providers/SystemPortHooks';
import PortStatus from '../../components/Ports/PortStatus';
import {OpenWorkShopIcon} from '@openworkshop/ui/components';
import {
  WorkspaceSettingsInput,
  useCreateWorkspaceMutation,
  MachineSettingSettingsInput,
  MachinePartSettingsInput,
} from '../../api/graphql';
import Colors from '@openworkshop/ui/themes/Colors';
import {
  MachinePartCompleteFragment,
  MachinePresetSettingPropsFragment
} from '@openworkshop/lib/api/graphql';
import AlertList from '@openworkshop/ui/components/Alerts/AlertList';
import {IAlertMessage} from '@openworkshop/ui/components/Alerts/AlertMessage';
import { Redirect } from 'react-router-dom';

type Props = {
  machine?: ICustomizedMachine;
  portName?: string;
  open: boolean;
  onClose: () => void;
};

const CreateWorkspaceModal: React.FunctionComponent<Props> = (props) => {
  const log = useLogger(CreateWorkspaceModal);
  const { t } = useTranslation();
  const { open, onClose, machine, portName } = props;
  const ports = useSystemPorts();
  const port = portName ? ports.portMap[portName] : undefined;
  const theme = useTheme();
  const [preferImperial, setPreferImperial] = React.useState(false);
  const [autoReconnect, setAutoReconnect] = React.useState(false);
  const [workspaceName, setWorkspaceName] = React.useState('');
  const [workspaceId, setWorkspaceId] = React.useState('');
  const classes = useStyles();
  const icon = machine?.icon ?? 'xyz';
  const [createWorkspace, createdWorkspace] = useCreateWorkspaceMutation();
  const isLoading = createdWorkspace.loading;
  const canCreate = machine && portName && !isLoading && workspaceName.length >= 3;
  const [error, setError] = React.useState<IAlertMessage | undefined>(undefined);

  function updateWorkspaceName(name: string) {
    setWorkspaceName(name);
    setWorkspaceId(slugify(name));
  }

  function getSettingsInput(setting: MachinePresetSettingPropsFragment): MachineSettingSettingsInput {
    return {
      id: setting.id,
      key: setting.key,
      settingType: setting.settingType,
      title: setting.title,
      value: setting.value,
    };
  }

  function getPartInput(part: MachinePartCompleteFragment): MachinePartSettingsInput {
    return {
      dataBlob: part.dataBlob,
      description: part.description,
      id: part.id,
      isDefault: part.isDefault,
      optional: part.optional,
      partType: part.partType,
      title: part.title,
      specs: part.specs.map((setting) => {
        return _.omit(setting, ['__typename']);
      }),
      settings: part.settings.map(getSettingsInput),
    };
  }

  async function onPressCreate() {
    if (!machine) {
      log.error('no machine before create');
      return;
    }
    if (!portName) {
      log.error('no portName before create');
      return;
    }
    // Smush the OWS types into a Workspace.
    const workspaceSettings: WorkspaceSettingsInput = {
      id: workspaceId,
      name: workspaceName,
      path: `/${workspaceId}`,
      color: Colors.blue.main,
      bkColor: theme.palette.background.default,
      autoReconnect,
      icon,
      preferImperial,
      machineProfileId: machine.profile.machineProfileId ?? null,
      onboarded: false,
      axes: Object.values(machine.axes).map((axis) => {
        return _.omit(axis, ['__typename']);
      }),
      commands: machine.commands.map((cmd) => {
        return _.omit(cmd, ['__typename']);
      }),
      connection: {
        portName,
        manufacturer: null,
        firmware: {
          ..._.omit(machine.firmware, ['__typename']),
          baudRate: null, // Different enum types; passed as baudRateValue.
        },
      },
      features: machine.features.map((ft) => {
        return _.omit(ft, ['__typename']);
      }),
      parts: machine.parts.map(getPartInput),
    };
    log.debug('create workspace', workspaceSettings);
    setError(undefined);

    try {
      await createWorkspace({ variables: { workspaceSettings } });
    } catch (e) {
      setError(e);
    }
  }

  if (createdWorkspace.data && createdWorkspace.data.workspace) {
    return <Redirect to={`/workspaces/${createdWorkspace.data.workspace.id}`} />;
  }

  return (
    <CardDialog
      open={open}
      onClose={onClose}
      title={t('Create Workspace')}
      subHeader={<PortStatus port={port} showType={true} />}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} >
          <FormControl
            className={classes.formControl}
            margin='normal'
            fullWidth={true}
            required={true}
            variant='outlined'
          >
            <InputLabel htmlFor='workspace-name'>{t('Workspace Name')}</InputLabel>
            <Input
              id='workspace-name'
              name='workspace-name'
              error={false}
              type='text'
              value={workspaceName}
              autoFocus={true}
              onChange={(e) => updateWorkspaceName(e.target.value)}
              startAdornment={<OpenWorkShopIcon name={icon} className={classes.leftButtonIconAdornment} />}
            />
            <FormHelperText >{window.location.origin}/workspaces/<strong>{workspaceId}</strong></FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6"><Trans>Personal Preferences</Trans></Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={<Checkbox checked={preferImperial} onChange={() => setPreferImperial(!preferImperial)} />}
              label={t('I prefer imperial (inches) to metric (mm)')}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={<Checkbox checked={autoReconnect} onChange={() => setAutoReconnect(!autoReconnect)} />}
              label={t('Automatically (re)connect to the machine when the workspace is opened.')}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6"><Trans>One Last Thing...</Trans></Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <Trans>
              Makerverse is an open-source project with a rich history and ambitious goals.
              <analytics.OutboundLink
                eventLabel='learn more'
                to={docs.urlAbout}
                target='_blank'>
                {t('Learn More')}
              </analytics.OutboundLink>
            </Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: 'center' }} >
          <FormControl
            className={classes.formControl}
          >
            <Fab
              color='primary'
              type='submit'
              variant='extended'
              size='large'
              onClick={onPressCreate}
              disabled={!canCreate}
            >
              <OpenWorkShopIcon name={icon} className={classes.leftButtonIconAdornment} />
              <Typography variant="h6">{t('Start Making Something')}</Typography>
            </Fab>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <AlertList error={error} />
        </Grid>
      </Grid>
    </CardDialog>
  );
};

export default CreateWorkspaceModal;
