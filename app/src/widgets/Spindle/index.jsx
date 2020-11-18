import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Space } from 'components-old/';
import Widget from 'components-old/Widget';
import Workspaces from 'lib/workspaces';
import i18n from 'lib/i18n';
import WidgetConfig from '../WidgetConfig';
import Spindle from './Spindle';
import {
  // Grbl
  GRBL,
  // Marlin
  MARLIN,
  // Workflow
  WORKFLOW_STATE_RUNNING,
} from '../../constants';
import styles from './index.styl';

class SpindleWidget extends PureComponent {
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
    handleSpindleSpeedChange: (event) => {
      const spindleSpeed = Number(event.target.value) || 0;
      this.setState({ spindleSpeed: spindleSpeed });
    },
  };

  controllerEvents = {
    'serialport:open': (options) => {
      const { port } = options;
      this.setState({ port: port });
    },
    'serialport:close': (options) => {
      const initialState = this.getInitialState();
      this.setState({ ...initialState });
    },
    'workflow:state': (workflowState) => {
      this.setState((state) => ({
        workflow: {
          state: workflowState,
        },
      }));
    },
    'controller:state': (type, state) => {
      // Grbl
      if (type === GRBL) {
        const { parserstate } = { ...state };
        const { modal = {} } = { ...parserstate };

        this.setState({
          controller: {
            type: type,
            state: state,
            modal: {
              spindle: modal.spindle || '',
              coolant: modal.coolant || '',
            },
          },
        });
      }

      // Marlin
      if (type === MARLIN) {
        const { modal = {} } = { ...state };

        this.setState({
          controller: {
            type: type,
            state: state,
            modal: {
              spindle: modal.spindle || '',
              coolant: modal.coolant || '',
            },
          },
        });
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
    const { minimized, spindleSpeed } = this.state;

    this.config.set('minimized', minimized);
    this.config.set('speed', spindleSpeed);
  }

  getInitialState() {
    return {
      minimized: this.config.get('minimized', false),
      isFullscreen: false,
      canClick: true, // Defaults to true
      port: this.workspace.controller.port,
      controller: {
        type: this.workspace.controller.type,
        state: this.workspace.controller.state,
        modal: {
          spindle: '',
          coolant: '',
        },
      },
      workflow: {
        state: this.workspace.controller.workflow.state,
      },
      spindleSpeed: this.config.get('speed', 1000),
    };
  }

  canClick() {
    const { port, workflow } = this.state;

    if (!port) {
      return false;
    }
    if (workflow.state === WORKFLOW_STATE_RUNNING) {
      return false;
    }

    this.workspace.activeState.updateControllerState(this.state.controller.state);
    return this.workspace.activeState.canReceiveCommand;
  }

  render() {
    const { widgetId } = this.props;
    const { minimized, isFullscreen } = this.state;
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
            {i18n._('Spindle')}
          </Widget.Title>
          <Widget.Controls className={this.props.sortable.filterClassName}>
            <Widget.Button
              disabled={isFullscreen}
              title={minimized ? i18n._('Expand') : i18n._('Collapse')}
              onClick={actions.toggleMinimized}>
              <i className={classNames('fa', { 'fa-chevron-up': !minimized }, { 'fa-chevron-down': minimized })} />
            </Widget.Button>
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
              <Widget.DropdownMenuItem eventKey='fullscreen'>
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
        <Widget.Content className={classNames(styles['widget-content'], { [styles.hidden]: minimized })}>
          <Spindle workspaceId={this.workspace.id} state={state} actions={actions} />
        </Widget.Content>
      </Widget>
    );
  }
}

export default SpindleWidget;
