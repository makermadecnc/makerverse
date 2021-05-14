import React from 'react';
// import _ from 'lodash';
import Select from 'react-select';
import cx from 'classnames';
import i18n from 'app/lib/i18n';
import { ToastNotification } from 'app/components/Notifications';
import ColorPicker from 'app/components/ColorPicker';
import { Input } from 'app/components/FormControl';
import Workspaces from 'app/lib/workspaces';
import AxisGrid from 'app/containers/Settings/WorkspaceSettings/AxisGrid';
import styles from './index.styl';

class CustomizeWorkspace extends React.PureComponent {
    state = { autoReconnect: false, preferImperial: false };

    setSetting(key, value) {
        const s = { ...this.props.workspaceSettings, [key]: value };
        this.props.actions.updateWorkspace(s);
    }

    renderAxis(key, axis) {
        const wss = this.props.workspaceSettings;
        return (
            <div style={{ marginBottom: 20 }} >
                <label className="control-label">
                    {i18n._('{{ axis }}-Axis', { axis: axis.name })}
                </label>
                <br />
                <AxisGrid
                    name={key}
                    axis={axis}
                    onChange={(name, value) => {
                        console.log('change', name, value);
                        this.props.actions.setAxisValue(key, name, value, wss);
                    }}
                />
                {!axis.validRange && (
                    <ToastNotification type="warning">
                        {i18n._('Axis is very small (min and max close together).')}
                    </ToastNotification>
                )}
                {!axis.validAccuracy && (
                    <ToastNotification type="warning">
                        {i18n._('Accuracy is unusual (defines minimum travel distance on axis).')}
                    </ToastNotification>
                )}
                {!axis.validPrecision && (
                    <ToastNotification type="warning">
                        {i18n._('Precision is unusual (defines number of digits for rounding).')}
                    </ToastNotification>
                )}
            </div>
        );
    }

    renderIcon(icon) {
        return (
            <img
                alt={`${icon.label} icon`}
                src={`/images/icons/${icon.value}.svg`}
            />
        );
    }

    createWorkspace(workspaceSettings) {
        this.props.actions.handleCreateWorkspace({
            ...workspaceSettings,
            bkColor: workspaceSettings.bkColor || Workspaces.defaultBkColor,
            color: workspaceSettings.color || Workspaces.defaultColor,
            icon: workspaceSettings.icon || Workspaces.defaultIcon,
            autoReconnect: this.state.autoReconnect,
            preferImperial: this.state.preferImperial,
        });
    }

    render() {
        const { autoReconnect, preferImperial } = this.state;
        const { actions, connectionStatus, workspaceSettings } = this.props;

        const icons = ['xyz', 'maslow', '3dp', 'cnc', 'makermade'];
        // const color = workspaceSettings.color || Workspaces.defaultColor;
        const bkColor = workspaceSettings.bkColor || Workspaces.defaultBkColor;
        const icon = workspaceSettings.icon || Workspaces.defaultIcon;
        const name = workspaceSettings.name || '';
        const axes = actions.getAxisMap([], workspaceSettings.axes);
        const show = connectionStatus.hasValidFirmware;
        const canCreate = show && name.length > 0;
        // TODO: should we enforce axis validity?

        return (
            <div style={{ margin: 0, padding: 0 }}>
                <div
                    className={cx('form-group', styles.widgetHeader)}
                >
                    <h6>{i18n._('Customize Workspace')}</h6>
                </div>
                {show && (
                    <div
                        className={cx('container-fluid', styles.widgetCenter)}
                        style={{ padding: 20 }}
                    >
                        <div className="row">
                            <div className="col-lg-6">
                                {workspaceSettings.machineProfileId && (
                                    <ToastNotification type="info" style={{ marginBottom: 10 }}>
                                        {i18n._('Axes have been set by your machine profile.')}
                                    </ToastNotification>
                                )}
                                {this.renderAxis('x', axes.x)}
                                {this.renderAxis('y', axes.y)}
                                {this.renderAxis('z', axes.z)}
                            </div>
                            <div className="form-group col-lg-6">
                                <label className="control-label">{i18n._('Name')}</label>
                                <Input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder={i18n._('Workspace name')}
                                    value={name}
                                    onChange={e => this.setSetting('name', e.target.value) }
                                />
                                <div className={styles.widgetControl}>
                                    <label className="control-label">{i18n._('Icon')}</label>
                                    <br />
                                    <Select
                                        backspaceRemoves={false}
                                        className="sm"
                                        clearable={false}
                                        style={{ width: 120, height: 100 }}
                                        menuContainerStyle={{ zIndex: 9999 }}
                                        name="icon"
                                        onChange={(o) => this.setSetting('icon', o.value)}
                                        options={icons.map((i) => ({
                                            value: i,
                                            label: i,
                                        }))}
                                        placeholder={i18n._('Choose an icon')}
                                        searchable={false}
                                        value={icon}
                                        valueRenderer={this.renderIcon}
                                    />
                                </div>
                                <div className={styles.widgetControl} >
                                    <label className="control-label">{i18n._('Background Color')}</label>
                                    <br />
                                    <ColorPicker
                                        color={bkColor}
                                        setColor={(c) => this.setSetting('bkColor', c.hex)}
                                    />
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <div className="checkbox-setting">
                                        <label>
                                            <input
                                                type="checkbox"
                                                defaultChecked={autoReconnect}
                                                onChange={() => this.setState({ autoReconnect: !autoReconnect })}
                                            />
                                            {i18n._('Connect automatically')}
                                        </label>
                                    </div>
                                    <div className="checkbox-setting">
                                        <label>
                                            <input
                                                type="checkbox"
                                                defaultChecked={preferImperial}
                                                onChange={() => this.setState({ preferImperial: !preferImperial })}
                                            />
                                            {i18n._('Prefer inches?')}
                                        </label>
                                    </div>
                                </div>
                                <div style={{ marginTop: 80 }} >
                                    {canCreate && (
                                        <button
                                            type="button"
                                            style={{ padding: 20 }}
                                            className={cx(
                                                'btn',
                                                'btn-large',
                                                'btn-primary',
                                            )}
                                            onClick={() => {
                                                this.createWorkspace(workspaceSettings);
                                            }}
                                            disabled={this.props.creating}
                                        >
                                            <h6 style={{ color: 'white' }}>
                                                {i18n._('Create Workspace')}
                                            </h6>
                                            {i18n._('Your machine\'s new home.')}
                                        </button>
                                    )}
                                    {this.props.createError && (
                                        <ToastNotification type="error">
                                            {this.props.createError}
                                        </ToastNotification>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!show && (
                    <div
                        className={styles.widgetCenter}
                        style={{ fontStyle: 'italic', padding: 20, textAlign: 'center' }}
                    >
                        {i18n._('Please connect to your machine, first.')}
                    </div>
                )}
            </div>
        );
    }
}

export default CustomizeWorkspace;
