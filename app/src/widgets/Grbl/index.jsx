import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Space } from 'components-old/';
import Widget from 'components-old/Widget';
import i18n from 'lib/i18n';
import Workspaces from 'lib/workspaces';
import analytics from 'lib/analytics';
import WidgetConfig from '../WidgetConfig';
import Grbl from './Grbl';
import Controller from './Controller';
import { GRBL } from '../../constants';
import { MODAL_NONE, MODAL_CONTROLLER } from './constants';
import styles from './index.styl';

class GrblWidget extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    widgetId: PropTypes.string.isRequired,
    onFork: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    sortable: PropTypes.object,
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  // Public methods
  collapse = () => {
    this.setState({ minimized: true });
  };

  expand = () => {
    this.setState({ minimized: false });
  };

  config = new WidgetConfig(this.props.widgetId);

  state = this.getInitialState();

  actions = {
    toggleFullscreen: () => {
      const { minimized, isFullscreen } = this.state;
      this.setState({
        minimized: isFullscreen ? minimized : false,
        isFullscreen: !isFullscreen,
      });
    },
    toggleMinimized: () => {
      const { minimized } = this.state;
      this.setState({ minimized: !minimized });
    },
    openModal: (name = MODAL_NONE, params = {}) => {
      if (name && name.length > 0 && name !== MODAL_NONE) {
        analytics.modalview(name);
      }
      this.setState({
        modal: {
          name: name,
          params: params,
        },
      });
    },
    closeModal: () => {
      this.setState({
        modal: {
          name: MODAL_NONE,
          params: {},
        },
      });
    },
    updateModalParams: (params = {}) => {
      this.setState({
        modal: {
          ...this.state.modal,
          params: {
            ...this.state.modal.params,
            ...params,
          },
        },
      });
    },
    toggleQueueReports: () => {
      const expanded = this.state.panel.queueReports.expanded;

      this.setState({
        panel: {
          ...this.state.panel,
          queueReports: {
            ...this.state.panel.queueReports,
            expanded: !expanded,
          },
        },
      });
    },
    toggleStatusReports: () => {
      const expanded = this.state.panel.statusReports.expanded;

      this.setState({
        panel: {
          ...this.state.panel,
          statusReports: {
            ...this.state.panel.statusReports,
            expanded: !expanded,
          },
        },
      });
    },
    toggleModalGroups: () => {
      const expanded = this.state.panel.modalGroups.expanded;

      this.setState({
        panel: {
          ...this.state.panel,
          modalGroups: {
            ...this.state.panel.modalGroups,
            expanded: !expanded,
          },
        },
      });
    },
  };

  controllerEvents = {
    'serialport:open': (options) => {
      const { port, controllerType } = options;
      this.setState({
        isReady: controllerType === GRBL,
        port: port,
      });
    },
    'serialport:close': (options) => {
      const initialState = this.getInitialState();
      this.setState({ ...initialState });
    },
    'controller:settings': (type, controllerSettings) => {
      if (type === GRBL) {
        this.setState((state) => ({
          controller: {
            ...state.controller,
            type: type,
            settings: controllerSettings,
          },
        }));
      }
    },
    'controller:state': (type, controllerState) => {
      if (type === GRBL) {
        this.setState((state) => ({
          controller: {
            ...state.controller,
            type: type,
            state: controllerState,
          },
        }));
      }
    },
  };

  componentDidMount() {
    this.workspace.addControllerEvents(this.controllerEvents);
  }

  componentWillUnmount() {
    this.workspace.removeControllerEvents(this.controllerEvents);
  }

  componentDidUpdate(prevProps, prevState) {
    const { minimized, panel } = this.state;

    this.config.set('minimized', minimized);
    this.config.set('panel.queueReports.expanded', panel.queueReports.expanded);
    this.config.set('panel.statusReports.expanded', panel.statusReports.expanded);
    this.config.set('panel.modalGroups.expanded', panel.modalGroups.expanded);
  }

  getInitialState() {
    return {
      minimized: this.config.get('minimized', false),
      isFullscreen: false,
      isReady: this.workspace.controller.loadedControllers.length === 1 || this.workspace.controller.type === GRBL,
      canClick: true, // Defaults to true
      port: this.workspace.controller.port,
      controller: {
        type: this.workspace.controller.type,
        settings: this.workspace.controller.settings,
        state: this.workspace.controller.state,
      },
      modal: {
        name: MODAL_NONE,
        params: {},
      },
      panel: {
        queueReports: {
          expanded: this.config.get('panel.queueReports.expanded'),
        },
        statusReports: {
          expanded: this.config.get('panel.statusReports.expanded'),
        },
        modalGroups: {
          expanded: this.config.get('panel.modalGroups.expanded'),
        },
      },
    };
  }

  canClick() {
    const { port } = this.state;
    const { type } = this.state.controller;

    if (!port) {
      return false;
    }
    if (type !== GRBL) {
      return false;
    }

    return true;
  }

  render() {
    const { widgetId } = this.props;
    const { minimized, isFullscreen, isReady } = this.state;
    const isForkedWidget = widgetId.match(/\w+:[\w\-]+/);
    const state = {
      ...this.state,
      canClick: this.canClick(),
    };
    const actions = {
      ...this.actions,
    };

    return (
      <Widget fullscreen={isFullscreen}>
        <Widget.Header>
          <Widget.Title>
            <Widget.Sortable className={this.props.sortable.handleClassName}>
              <i className='fa fa-bars' />
              <Space width='8' />
            </Widget.Sortable>
            {isForkedWidget && <i className='fa fa-code-fork' style={{ marginRight: 5 }} />}
            Grbl
          </Widget.Title>
          <Widget.Controls className={this.props.sortable.filterClassName}>
            {isReady && (
              <Widget.Button
                onClick={(event) => {
                  actions.openModal(MODAL_CONTROLLER);
                }}>
                <i className='fa fa-info' />
              </Widget.Button>
            )}
            {isReady && (
              <Widget.DropdownButton toggle={<i className='fa fa-th-large' />}>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.write('?')}
                  disabled={!state.canClick}>
                  {i18n._('Status Report (?)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$C')}
                  disabled={!state.canClick}>
                  {i18n._('Check G-code Mode ($C)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.command('homing')}
                  disabled={!state.canClick}>
                  {i18n._('Homing ($H)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.command('unlock')}
                  disabled={!state.canClick}>
                  {i18n._('Kill Alarm Lock ($X)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.command('sleep')}
                  disabled={!state.canClick}>
                  {i18n._('Sleep ($SLP)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem divider />
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$')}
                  disabled={!state.canClick}>
                  {i18n._('Help ($)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$$')}
                  disabled={!state.canClick}>
                  {i18n._('Settings ($$)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$#')}
                  disabled={!state.canClick}>
                  {i18n._('View G-code Parameters ($#)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$G')}
                  disabled={!state.canClick}>
                  {i18n._('View G-code Parser State ($G)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$I')}
                  disabled={!state.canClick}>
                  {i18n._('View Build Info ($I)')}
                </Widget.DropdownMenuItem>
                <Widget.DropdownMenuItem
                  onSelect={() => this.workspace.controller.writeln('$N')}
                  disabled={!state.canClick}>
                  {i18n._('View Startup Blocks ($N)')}
                </Widget.DropdownMenuItem>
              </Widget.DropdownButton>
            )}
            {isReady && (
              <Widget.Button
                disabled={isFullscreen}
                title={minimized ? i18n._('Expand') : i18n._('Collapse')}
                onClick={actions.toggleMinimized}>
                <i className={classNames('fa', { 'fa-chevron-up': !minimized }, { 'fa-chevron-down': minimized })} />
              </Widget.Button>
            )}
            <Widget.DropdownButton
              title={i18n._('More')}
              toggle={<i className='fa fa-ellipsis-v' />}
              onSelect={(eventKey) => {
                if (eventKey === 'fullscreen') {
                  actions.toggleFullscreen();
                } else if (eventKey === 'fork') {
                  this.props.onFork();
                } else if (eventKey === 'remove') {
                  this.props.onRemove();
                }
              }}>
              <Widget.DropdownMenuItem eventKey='fullscreen' disabled={!isReady}>
                <i
                  className={classNames('fa', 'fa-fw', { 'fa-expand': !isFullscreen }, { 'fa-compress': isFullscreen })}
                />
                <Space width='4' />
                {!isFullscreen ? i18n._('Enter Full Screen') : i18n._('Exit Full Screen')}
              </Widget.DropdownMenuItem>
              <Widget.DropdownMenuItem eventKey='fork'>
                <i className='fa fa-fw fa-code-fork' />
                <Space width='4' />
                {i18n._('Fork Widget')}
              </Widget.DropdownMenuItem>
              <Widget.DropdownMenuItem eventKey='remove'>
                <i className='fa fa-fw fa-times' />
                <Space width='4' />
                {i18n._('Remove Widget')}
              </Widget.DropdownMenuItem>
            </Widget.DropdownButton>
          </Widget.Controls>
        </Widget.Header>
        {isReady && (
          <Widget.Content className={classNames(styles['widget-content'], { [styles.hidden]: minimized })}>
            {state.modal.name === MODAL_CONTROLLER && (
              <Controller controller={this.workspace.controller} state={state} actions={actions} />
            )}
            <Grbl workspaceId={this.workspace.id} state={state} actions={actions} />
          </Widget.Content>
        )}
      </Widget>
    );
  }
}

export default GrblWidget;
