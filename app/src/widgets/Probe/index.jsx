import get from 'lodash/get';
import includes from 'lodash/includes';
import map from 'lodash/map';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Space } from 'components-old/';
import Widget from 'components-old/Widget';
import Workspaces from 'lib/workspaces';
import i18n from 'lib/i18n';
import analytics from 'lib/analytics';
import { in2mm, mapValueToUnits } from 'lib/units';
import WidgetConfig from '../WidgetConfig';
import Probe from './Probe';
import RunProbe from './RunProbe';
import {
  // Units
  IMPERIAL_UNITS,
  METRIC_UNITS,
  GRBL,
  // Marlin
  MARLIN,
  // Workflow
  WORKFLOW_STATE_IDLE,
} from '../../constants';
import { MODAL_NONE, MODAL_PREVIEW } from './constants';
import styles from './index.styl';

const gcode = (cmd, params) => {
  const s = map(params, (value, letter) => String(letter + value)).join(' ');
  return s.length > 0 ? cmd + ' ' + s : cmd;
};

class ProbeWidget extends PureComponent {
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
    changeProbeAxis: (value) => {
      this.setState({ probeAxis: value });
    },
    changeProbeCommand: (value) => {
      this.setState({ probeCommand: value });
    },
    toggleUseTLO: () => {
      const { useTLO } = this.state;
      this.setState({ useTLO: !useTLO });
    },
    handleProbeDepthChange: (event) => {
      const probeDepth = event.target.value;
      this.setState({ probeDepth });
    },
    handleProbeFeedrateChange: (event) => {
      const probeFeedrate = event.target.value;
      this.setState({ probeFeedrate });
    },
    handleTouchPlateHeightChange: (event) => {
      const touchPlateHeight = event.target.value;
      this.setState({ touchPlateHeight });
    },
    handleRetractionDistanceChange: (event) => {
      const retractionDistance = event.target.value;
      this.setState({ retractionDistance });
    },
    populateProbeCommands: () => {
      const {
        probeAxis,
        probeCommand,
        useTLO,
        probeDepth,
        probeFeedrate,
        touchPlateHeight,
        retractionDistance,
      } = this.state;
      const wcs = this.getWorkCoordinateSystem();
      const mapWCSToP = (wcs) =>
        ({
          G54: 1,
          G55: 2,
          G56: 3,
          G57: 4,
          G58: 5,
          G59: 6,
        }[wcs] || 0);
      const towardWorkpiece = includes(['G38.2', 'G38.3'], probeCommand);
      const posname = `pos${probeAxis.toLowerCase()}`;
      const tloProbeCommands = [
        gcode('; Cancel tool length offset'),
        // Cancel tool length offset
        gcode('G49'),

        // Probe (use relative distance mode)
        gcode(`; ${probeAxis}-Probe`),
        gcode('G91'),
        gcode(probeCommand, {
          [probeAxis]: towardWorkpiece ? -probeDepth : probeDepth,
          F: probeFeedrate,
        }),
        // Use absolute distance mode
        gcode('G90'),

        // Dwell
        gcode('; A dwell time of one second'),
        gcode('G4 P1'),

        // Apply touch plate height with tool length offset
        gcode('; Set tool length offset'),
        gcode('G43.1', {
          [probeAxis]: towardWorkpiece ? `[${posname}-${touchPlateHeight}]` : `[${posname}+${touchPlateHeight}]`,
        }),

        // Retract from the touch plate (use relative distance mode)
        gcode('; Retract from the touch plate'),
        gcode('G91'),
        gcode('G0', {
          [probeAxis]: retractionDistance,
        }),
        // Use asolute distance mode
        gcode('G90'),
      ];
      const wcsProbeCommands = [
        // Probe (use relative distance mode)
        gcode(`; ${probeAxis}-Probe`),
        gcode('G91'),
        gcode(probeCommand, {
          [probeAxis]: towardWorkpiece ? -probeDepth : probeDepth,
          F: probeFeedrate,
        }),
        // Use absolute distance mode
        gcode('G90'),

        // Set the WCS 0 offset
        gcode(`; Set the active WCS ${probeAxis}0`),
        gcode('G10', {
          L: 20,
          P: mapWCSToP(wcs),
          [probeAxis]: touchPlateHeight,
        }),

        // Retract from the touch plate (use relative distance mode)
        gcode('; Retract from the touch plate'),
        gcode('G91'),
        gcode('G0', {
          [probeAxis]: retractionDistance,
        }),
        // Use absolute distance mode
        gcode('G90'),
      ];

      return useTLO ? tloProbeCommands : wcsProbeCommands;
    },
    runProbeCommands: (commands) => {
      this.workspace.controller.command('gcode', commands);
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
      let units = this.state.units;

      // Grbl
      if (type === GRBL) {
        const { parserstate } = { ...state };
        const { modal = {} } = { ...parserstate };
        units =
          {
            G20: IMPERIAL_UNITS,
            G21: METRIC_UNITS,
          }[modal.units] || units;
      }

      // Marlin
      if (type === MARLIN) {
        const { modal = {} } = { ...state };
        units =
          {
            G20: IMPERIAL_UNITS,
            G21: METRIC_UNITS,
          }[modal.units] || units;
      }

      this.setState({
        units: units,
        controller: {
          type: type,
          state: state,
        },
        probeDepth: mapValueToUnits(this.config.get('probeDepth'), units),
        probeFeedrate: mapValueToUnits(this.config.get('probeFeedrate'), units),
        touchPlateHeight: mapValueToUnits(this.config.get('touchPlateHeight'), units),
        retractionDistance: mapValueToUnits(this.config.get('retractionDistance'), units),
      });
    },
  };

  unitsDidChange = false;

  componentDidMount() {
    this.workspace.addControllerEvents(this.controllerEvents);
  }

  componentWillUnmount() {
    this.workspace.removeControllerEvents(this.controllerEvents);
  }

  componentDidUpdate(prevProps, prevState) {
    const { minimized } = this.state;

    this.config.set('minimized', minimized);

    // Do not save config settings if the units did change between in and mm
    if (this.unitsDidChange) {
      this.unitsDidChange = false;
      return;
    }

    const { units, probeCommand, useTLO } = this.state;
    this.config.set('probeCommand', probeCommand);
    this.config.set('useTLO', useTLO);

    let { probeDepth, probeFeedrate, touchPlateHeight, retractionDistance } = this.state;

    // To save in mm
    if (units === IMPERIAL_UNITS) {
      probeDepth = in2mm(probeDepth);
      probeFeedrate = in2mm(probeFeedrate);
      touchPlateHeight = in2mm(touchPlateHeight);
      retractionDistance = in2mm(retractionDistance);
    }
    this.config.set('probeDepth', Number(probeDepth));
    this.config.set('probeFeedrate', Number(probeFeedrate));
    this.config.set('touchPlateHeight', Number(touchPlateHeight));
    this.config.set('retractionDistance', Number(retractionDistance));
  }

  getInitialState() {
    return {
      minimized: this.config.get('minimized', false),
      isFullscreen: false,
      canClick: true, // Defaults to true
      port: this.workspace.controller.port,
      units: METRIC_UNITS,
      controller: {
        type: this.workspace.controller.type,
        state: this.workspace.controller.state,
      },
      workflow: {
        state: this.workspace.controller.workflow.state,
      },
      modal: {
        name: MODAL_NONE,
        params: {},
      },
      probeAxis: this.config.get('probeAxis', 'Z'),
      probeCommand: this.config.get('probeCommand', 'G38.2'),
      useTLO: this.config.get('useTLO'),
      probeDepth: Number(this.config.get('probeDepth') || 0).toFixed(3) * 1,
      probeFeedrate: Number(this.config.get('probeFeedrate') || 0).toFixed(3) * 1,
      touchPlateHeight: Number(this.config.get('touchPlateHeight') || 0).toFixed(3) * 1,
      retractionDistance: Number(this.config.get('retractionDistance') || 0).toFixed(3) * 1,
    };
  }

  getWorkCoordinateSystem() {
    const controllerType = this.state.controller.type;
    const controllerState = this.state.controller.state;
    const defaultWCS = 'G54';

    if (controllerType === GRBL) {
      return get(controllerState, 'parserstate.modal.wcs') || defaultWCS;
    }

    if (controllerType === MARLIN) {
      return get(controllerState, 'modal.wcs') || defaultWCS;
    }

    return defaultWCS;
  }

  canClick() {
    const { port, workflow } = this.state;

    if (!port) {
      return false;
    }
    if (workflow.state !== WORKFLOW_STATE_IDLE) {
      return false;
    }

    this.workspace.activeState.updateControllerState(this.state.controller.state);
    return this.workspace.activeState.canProbe;
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
            {i18n._('Probe')}
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
          {state.modal.name === MODAL_PREVIEW && (
            <RunProbe workspaceId={this.workspace.id} state={state} actions={actions} />
          )}
          <Probe workspaceId={this.workspace.id} state={state} actions={actions} />
        </Widget.Content>
      </Widget>
    );
  }
}

export default ProbeWidget;
