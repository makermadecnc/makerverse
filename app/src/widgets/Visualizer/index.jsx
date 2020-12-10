import chainedFunction from 'chained-function';
import classNames from 'classnames';
import ExpressionEvaluator from 'expr-eval';
import includes from 'lodash/includes';
import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import log from 'js-logger';
import Anchor from 'components-old/Anchor';
import { Button } from 'components-old/Buttons';
import ModalTemplate from 'components-old/ModalTemplate';
import Modal from 'components-old/Modal';
import Widget from 'components-old/Widget';
import Workspaces from 'lib/workspaces';
import i18n from 'lib/i18n';
import portal from 'lib/portal';
import * as WebGL from 'lib/three/WebGL';
import analytics from 'lib/analytics';
import WidgetConfig from '../WidgetConfig';
import PrimaryToolbar from './PrimaryToolbar';
import SecondaryToolbar from './SecondaryToolbar';
import WorkflowControl from './WorkflowControl';
import Visualizer from './Visualizer';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import Loading from './Loading';
import Rendering from './Rendering';
import WatchDirectory from './WatchDirectory';
import {
  // Units
  IMPERIAL_UNITS,
  METRIC_UNITS,
  // Workflow
  WORKFLOW_STATE_RUNNING,
  WORKFLOW_STATE_PAUSED,
  WORKFLOW_STATE_IDLE,
} from '../../constants';
import {
  CAMERA_MODE_PAN,
  CAMERA_MODE_ROTATE,
  MODAL_WATCH_DIRECTORY,
  NOTIFICATION_PROGRAM_ERROR,
  NOTIFICATION_M0_PROGRAM_PAUSE,
  NOTIFICATION_M1_PROGRAM_PAUSE,
  NOTIFICATION_M2_PROGRAM_END,
  NOTIFICATION_M30_PROGRAM_END,
  NOTIFICATION_M6_TOOL_CHANGE,
  NOTIFICATION_M109_SET_EXTRUDER_TEMPERATURE,
  NOTIFICATION_M190_SET_HEATED_BED_TEMPERATURE,
} from './constants';
import styles from './index.styl';

const translateExpression = (function () {
  const { Parser } = ExpressionEvaluator;
  const reExpressionContext = new RegExp(/\[[^\]]+\]/g);

  return function (gcode, controller, context) {
    if (typeof gcode !== 'string') {
      log.error(`Invalid parameter: gcode=${gcode}`);
      return '';
    }

    const lines = gcode.split('\n');

    // The work position (i.e. posx, posy, posz) are not included in the context
    context = {
      ...controller.context,
      ...context,
    };

    return lines
      .map((line) => {
        try {
          line = line.replace(reExpressionContext, (match) => {
            const expr = match.slice(1, -1);
            return Parser.evaluate(expr, context);
          });
        } catch (e) {
          // Bypass unknown expression
        }

        return line;
      })
      .join('\n');
  };
})();

const displayWebGLErrorMessage = () => {
  portal(({ onClose }) => (
    <Modal disableOverlay size='xs' onClose={onClose}>
      <Modal.Header>
        <Modal.Title>WebGL Error Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalTemplate type='warning'>
          {window.WebGLRenderingContext && (
            <div>
              Your graphics card does not seem to support{' '}
              <Anchor href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>WebGL</Anchor>.
              <br />
              Find out how to get it <Anchor href='http://get.webgl.org/'>here</Anchor>.
            </div>
          )}
          {!window.WebGLRenderingContext && (
            <div>
              Your browser does not seem to support{' '}
              <Anchor href='http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation'>WebGL</Anchor>.
              <br />
              Find out how to get it <Anchor href='http://get.webgl.org/'>here</Anchor>.
            </div>
          )}
        </ModalTemplate>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>{i18n._('OK')}</Button>
      </Modal.Footer>
    </Modal>
  ));
};

class VisualizerWidget extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    widgetId: PropTypes.string.isRequired,
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  config = new WidgetConfig(this.props.widgetId);

  state = this.getInitialState();

  actions = {
    event: (opts) => {
      analytics.event({
        ...{ category: 'interaction', action: 'press', label: 'visualizer' },
        ...opts,
      });
    },
    dismissNotification: () => {
      this.setState((state) => ({
        notification: {
          ...state.notification,
          type: '',
          data: '',
        },
      }));
    },
    openModal: (name = '', params = {}) => {
      if (name && name.length > 0) {
        analytics.modalview(name);
      }
      this.setState((state) => ({
        modal: {
          name: name,
          params: params,
        },
      }));
    },
    closeModal: () => {
      this.setState((state) => ({
        modal: {
          name: '',
          params: {},
        },
      }));
    },
    updateModalParams: (params = {}) => {
      this.setState((state) => ({
        modal: {
          ...state.modal,
          params: {
            ...state.modal.params,
            ...params,
          },
        },
      }));
    },
    // Load file from watch directory
    loadFile: (file) => {
      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          loading: true,
          rendering: false,
          ready: false,
        },
      }));
      this.actions.event({ action: 'load', label: 'workflow' });

      this.workspace.controller.command('watchdir:load', file, (err, data) => {
        if (err) {
          this.setState((state) => ({
            gcode: {
              ...state.gcode,
              loading: false,
              rendering: false,
              ready: false,
            },
          }));

          log.error(err);
          return;
        }

        log.debug(data); // TODO
      });
    },
    uploadFile: (gcode, meta) => {
      const { name } = { ...meta };
      const context = {};

      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          loading: true,
          rendering: false,
          ready: false,
        },
      }));
      this.actions.event({ action: 'upload', label: 'workflow' });

      this.workspace.controller.command('gcode:load', name, gcode, context, (err, data) => {
        if (err) {
          this.setState((state) => ({
            gcode: {
              ...state.gcode,
              loading: false,
              rendering: false,
              ready: false,
            },
          }));

          log.error(err);
          return;
        }

        log.debug(data); // TODO
      });
    },
    loadGCode: (name, gcode) => {
      const capable = {
        view3D: !!this.visualizer,
      };

      const updater = (state) => ({
        gcode: {
          ...state.gcode,
          loading: false,
          rendering: capable.view3D,
          ready: !capable.view3D,
          content: gcode,
          bbox: {
            min: {
              x: 0,
              y: 0,
              z: 0,
            },
            max: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        },
      });
      const callback = () => {
        // Clear gcode bounding box
        this.workspace.controller.context = {
          ...this.workspace.controller.context,
          xmin: 0,
          xmax: 0,
          ymin: 0,
          ymax: 0,
          zmin: 0,
          zmax: 0,
        };

        if (!capable.view3D) {
          return;
        }

        setTimeout(() => {
          this.visualizer.load(name, gcode, ({ bbox }) => {
            // Set gcode bounding box
            this.workspace.controller.context = {
              ...this.workspace.controller.context,
              xmin: bbox.min.x,
              xmax: bbox.max.x,
              ymin: bbox.min.y,
              ymax: bbox.max.y,
              zmin: bbox.min.z,
              zmax: bbox.max.z,
            };

            pubsub.publish('gcode:bbox', bbox);

            this.setState((state) => ({
              gcode: {
                ...state.gcode,
                loading: false,
                rendering: false,
                ready: true,
                bbox: bbox,
              },
            }));
          });
        }, 0);
      };

      this.setState(updater, callback);
    },
    unloadGCode: () => {
      const visualizer = this.visualizer;
      if (visualizer) {
        visualizer.unload();
      }

      // Clear gcode bounding box
      this.workspace.controller.context = {
        ...this.workspace.controller.context,
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0,
        zmin: 0,
        zmax: 0,
      };
      this.actions.event({ action: 'unload', label: 'workflow' });

      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          loading: false,
          rendering: false,
          ready: false,
          content: '',
          bbox: {
            min: {
              x: 0,
              y: 0,
              z: 0,
            },
            max: {
              x: 0,
              y: 0,
              z: 0,
            },
          },
        },
      }));
    },
    handleRun: () => {
      const { workflow } = this.state;
      console.assert(includes([WORKFLOW_STATE_IDLE, WORKFLOW_STATE_PAUSED], workflow.state));

      if (workflow.state === WORKFLOW_STATE_IDLE) {
        this.workspace.controller.command('gcode:start');
        this.actions.event({ action: 'start', label: 'workflow' });
        return;
      }

      if (workflow.state === WORKFLOW_STATE_PAUSED) {
        const { notification } = this.state;
        this.actions.event({ action: 'resume', label: 'workflow' });

        // M6 Tool Change
        if (notification.type === NOTIFICATION_M6_TOOL_CHANGE) {
          portal(({ onClose }) => (
            <Modal disableOverlay size='xs' onClose={onClose}>
              <Modal.Header>
                <Modal.Title>{i18n._('Tool Change')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>{i18n._('Are you sure you want to resume program execution?')}</Modal.Body>
              <Modal.Footer>
                <Button onClick={onClose}>{i18n._('No')}</Button>
                <Button
                  btnStyle='primary'
                  onClick={chainedFunction(() => {
                    this.workspace.controller.command('gcode:resume');
                  }, onClose)}>
                  {i18n._('Yes')}
                </Button>
              </Modal.Footer>
            </Modal>
          ));

          return;
        }

        this.workspace.controller.command('gcode:resume');
      }
    },
    handlePause: () => {
      const { workflow } = this.state;
      console.assert(includes([WORKFLOW_STATE_RUNNING], workflow.state));
      this.actions.event({ action: 'pause', label: 'workflow' });

      this.workspace.controller.command('gcode:pause');
    },
    handleStop: () => {
      const { workflow } = this.state;
      console.assert(includes([WORKFLOW_STATE_PAUSED], workflow.state));
      this.actions.event({ action: 'stop', label: 'workflow' });

      this.workspace.controller.command('gcode:stop', { force: true });
    },
    handleClose: () => {
      const { workflow } = this.state;
      console.assert(includes([WORKFLOW_STATE_IDLE], workflow.state));
      this.actions.event({ action: 'close', label: 'workflow' });

      this.workspace.controller.command('gcode:unload');

      pubsub.publish('gcode:unload'); // Unload the G-code
    },
    setBoundingBox: (bbox) => {
      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          bbox: bbox,
        },
      }));
    },
    toggle3DView: () => {
      if (!WebGL.isWebGLAvailable() && this.state.disabled) {
        displayWebGLErrorMessage();
        return;
      }

      this.setState((state) => ({
        disabled: !state.disabled,
      }));
    },
    toPerspectiveProjection: (projection) => {
      this.actions.event({ action: 'perspective' });
      this.setState((state) => ({
        projection: 'perspective',
      }));
    },
    toOrthographicProjection: (projection) => {
      this.actions.event({ action: 'orthographic' });
      this.setState((state) => ({
        projection: 'orthographic',
      }));
    },
    toggleGCodeFilename: () => {
      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          displayName: !state.gcode.displayName,
        },
      }));
    },
    toggleLimitsVisibility: () => {
      this.actions.event({ action: 'toggle', label: 'limits' });
      this.setState((state) => ({
        objects: {
          ...state.objects,
          limits: {
            ...state.objects.limits,
            visible: !state.objects.limits.visible,
          },
        },
      }));
    },
    toggleCoordinateSystemVisibility: () => {
      this.actions.event({ action: 'toggle', label: 'coordinates' });
      this.setState((state) => ({
        objects: {
          ...state.objects,
          coordinateSystem: {
            ...state.objects.coordinateSystem,
            visible: !state.objects.coordinateSystem.visible,
          },
        },
      }));
    },
    toggleGridLineNumbersVisibility: () => {
      this.actions.event({ action: 'toggle', label: 'gridLineNumbers' });
      this.setState((state) => ({
        objects: {
          ...state.objects,
          gridLineNumbers: {
            ...state.objects.gridLineNumbers,
            visible: !state.objects.gridLineNumbers.visible,
          },
        },
      }));
    },
    toggleCuttingToolVisibility: () => {
      this.actions.event({ action: 'toggle', label: 'tool' });
      this.setState((state) => ({
        objects: {
          ...state.objects,
          cuttingTool: {
            ...state.objects.cuttingTool,
            visible: !state.objects.cuttingTool.visible,
          },
        },
      }));
    },
    camera: {
      toRotateMode: () => {
        this.actions.event({ action: 'camera', label: 'rotateMode' });
        this.setState((state) => ({
          cameraMode: CAMERA_MODE_ROTATE,
        }));
      },
      toPanMode: () => {
        this.actions.event({ action: 'camera', label: 'panMode' });
        this.setState((state) => ({
          cameraMode: CAMERA_MODE_PAN,
        }));
      },
      zoomFit: () => {
        this.actions.event({ action: 'camera', label: 'zoomFit' });
        if (this.visualizer) {
          this.visualizer.zoomFit();
        }
      },
      zoomIn: () => {
        this.actions.event({ action: 'camera', label: 'zoomIn' });
        if (this.visualizer) {
          this.visualizer.zoomIn();
        }
      },
      zoomOut: () => {
        this.actions.event({ action: 'camera', label: 'zoomOut' });
        if (this.visualizer) {
          this.visualizer.zoomOut();
        }
      },
      panUp: () => {
        this.actions.event({ action: 'camera', label: 'panUp' });
        if (this.visualizer) {
          this.visualizer.panUp();
        }
      },
      panDown: () => {
        this.actions.event({ action: 'camera', label: 'panDown' });
        if (this.visualizer) {
          this.visualizer.panDown();
        }
      },
      panLeft: () => {
        this.actions.event({ action: 'camera', label: 'panLeft' });
        if (this.visualizer) {
          this.visualizer.panLeft();
        }
      },
      panRight: () => {
        this.actions.event({ action: 'camera', label: 'panRight' });
        if (this.visualizer) {
          this.visualizer.panRight();
        }
      },
      lookAtCenter: () => {
        this.actions.event({ action: 'camera', label: 'lookAtCenter' });
        if (this.visualizer) {
          this.visualizer.lookAtCenter();
        }
      },
      toTopView: () => {
        this.actions.event({ action: 'camera', label: 'top' });
        this.setState({ cameraPosition: 'top' });
      },
      to3DView: () => {
        this.actions.event({ action: 'camera', label: '3d' });
        this.setState({ cameraPosition: '3d' });
      },
      toFrontView: () => {
        this.actions.event({ action: 'camera', label: 'front' });
        this.setState({ cameraPosition: 'front' });
      },
      toLeftSideView: () => {
        this.actions.event({ action: 'camera', label: 'left' });
        this.setState({ cameraPosition: 'left' });
      },
      toRightSideView: () => {
        this.actions.event({ action: 'camera', label: 'right' });
        this.setState({ cameraPosition: 'right' });
      },
    },
  };

  controllerEvents = {
    'serialport:open': (options) => {
      const { port } = options;
      this.setState((state) => ({ port: port }));
    },
    'serialport:close': (options) => {
      this.actions.unloadGCode();

      const initialState = this.getInitialState();
      this.setState((state) => ({ ...initialState }));
    },
    'gcode:load': (name, gcode, context) => {
      gcode = translateExpression(gcode, this.workspace.controller, context); // e.g. xmin,xmax,ymin,ymax,zmin,zmax
      this.actions.loadGCode(name, gcode);
    },
    'gcode:unload': () => {
      this.actions.unloadGCode();
    },
    'sender:status': (data) => {
      const { hold, holdReason, name, size, total, sent, received } = data;
      const notification = {
        type: '',
        data: '',
      };

      if (hold) {
        const { err, data } = { ...holdReason };

        if (err) {
          notification.type = NOTIFICATION_PROGRAM_ERROR;
          notification.data = err;
        } else if (data === 'M0') {
          // M0 Program Pause
          notification.type = NOTIFICATION_M0_PROGRAM_PAUSE;
        } else if (data === 'M1') {
          // M1 Program Pause
          notification.type = NOTIFICATION_M1_PROGRAM_PAUSE;
        } else if (data === 'M2') {
          // M2 Program End
          notification.type = NOTIFICATION_M2_PROGRAM_END;
        } else if (data === 'M30') {
          // M30 Program End
          notification.type = NOTIFICATION_M30_PROGRAM_END;
        } else if (data === 'M6') {
          // M6 Tool Change
          notification.type = NOTIFICATION_M6_TOOL_CHANGE;
        } else if (data === 'M109') {
          // M109 Set Extruder Temperature
          notification.type = NOTIFICATION_M109_SET_EXTRUDER_TEMPERATURE;
        } else if (data === 'M190') {
          // M190 Set Heated Bed Temperature
          notification.type = NOTIFICATION_M190_SET_HEATED_BED_TEMPERATURE;
        }
      }

      this.setState((state) => ({
        gcode: {
          ...state.gcode,
          name,
          size,
          total,
          sent,
          received,
        },
        notification: {
          ...state.notification,
          ...notification,
        },
      }));
    },
    'workflow:state': (workflowState) => {
      this.setState((state) => ({
        workflow: {
          ...state.workflow,
          state: workflowState,
        },
      }));
    },
    'controller:settings': (type, controllerSettings) => {
      this.setState((state) => ({
        controller: {
          ...state.controller,
          type: type,
          settings: controllerSettings,
        },
      }));
    },
    'controller:state': (type, controllerState) => {
      const activeState = this.workspace.activeState;
      activeState.updateControllerState(controllerState);
      const units = activeState.isImperialUnits ? IMPERIAL_UNITS : METRIC_UNITS;

      this.setState((state) => ({
        units: units,
        controller: {
          ...state.controller,
          type: type,
          state: controllerState,
        },
        machinePosition: this.workspace.mpos,
        workPosition: this.workspace.wpos,
      }));
    },
  };

  pubsubTokens = [];

  // refs
  // widgetContent = React.createRef();

  visualizerRef = React.createRef();

  get visualizer() {
    return this.visualizerRef.current;
  }

  componentDidMount() {
    this.workspace.addControllerEvents(this.controllerEvents);

    if (!WebGL.isWebGLAvailable() && !this.state.disabled) {
      displayWebGLErrorMessage();

      setTimeout(() => {
        this.setState((state) => ({
          disabled: true,
        }));
      }, 0);
    }
  }

  componentWillUnmount() {
    this.workspace.removeControllerEvents(this.controllerEvents);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.disabled !== prevState.disabled) {
      this.config.set('disabled', this.state.disabled);
    }
    if (this.state.projection !== prevState.projection) {
      this.config.set('projection', this.state.projection);
    }
    if (this.state.cameraMode !== prevState.cameraMode) {
      this.config.set('cameraMode', this.state.cameraMode);
    }
    if (this.state.gcode.displayName !== prevState.gcode.displayName) {
      this.config.set('gcode.displayName', this.state.gcode.displayName);
    }
    if (this.state.objects.limits.visible !== prevState.objects.limits.visible) {
      this.config.set('objects.limits.visible', this.state.objects.limits.visible);
    }
    if (this.state.objects.coordinateSystem.visible !== prevState.objects.coordinateSystem.visible) {
      this.config.set('objects.coordinateSystem.visible', this.state.objects.coordinateSystem.visible);
    }
    if (this.state.objects.gridLineNumbers.visible !== prevState.objects.gridLineNumbers.visible) {
      this.config.set('objects.gridLineNumbers.visible', this.state.objects.gridLineNumbers.visible);
    }
    if (this.state.objects.cuttingTool.visible !== prevState.objects.cuttingTool.visible) {
      this.config.set('objects.cuttingTool.visible', this.state.objects.cuttingTool.visible);
    }
  }

  getInitialState() {
    return {
      port: this.workspace.controller.port,
      units: METRIC_UNITS,
      controller: {
        type: this.workspace.controller.type,
        settings: this.workspace.controller.settings,
        state: this.workspace.controller.state,
      },
      workflow: {
        state: this.workspace.controller.workflow.state,
      },
      notification: {
        type: '',
        data: '',
      },
      modal: {
        name: '',
        params: {},
      },
      machinePosition: {
        // Machine position
        x: '0.000',
        y: '0.000',
        z: '0.000',
      },
      workPosition: {
        // Work position
        x: '0.000',
        y: '0.000',
        z: '0.000',
      },
      gcode: {
        displayName: this.config.get('gcode.displayName', true),
        loading: false,
        rendering: false,
        ready: false,
        content: '',
        bbox: {
          min: {
            x: 0,
            y: 0,
            z: 0,
          },
          max: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
        // Updates by the "sender:status" event
        name: '',
        size: 0,
        total: 0,
        sent: 0,
        received: 0,
      },
      disabled: this.config.get('disabled', false),
      projection: this.config.get('projection', 'orthographic'),
      objects: {
        limits: {
          visible: this.config.get('objects.limits.visible', true),
        },
        coordinateSystem: {
          visible: this.config.get('objects.coordinateSystem.visible', true),
        },
        gridLineNumbers: {
          visible: this.config.get('objects.gridLineNumbers.visible', true),
        },
        cuttingTool: {
          visible: this.config.get('objects.cuttingTool.visible', true),
        },
      },
      cameraMode: this.config.get('cameraMode', CAMERA_MODE_PAN),
      cameraPosition: 'top', // 'top', '3d', 'front', 'left', 'right'
      isAgitated: false, // Defaults to false
    };
  }

  isAgitated() {
    const { workflow, disabled, objects } = this.state;

    if (workflow.state !== WORKFLOW_STATE_RUNNING) {
      return false;
    }
    // Return false when 3D view is disabled
    if (disabled) {
      return false;
    }
    // Return false when the cutting tool is not visible
    if (!objects.cuttingTool.visible) {
      return false;
    }

    this.workspace.activeState.updateControllerState(this.state.controller.state);
    return this.workspace.activeState.isAgitated;
  }

  render() {
    const state = {
      ...this.state,
      isAgitated: this.isAgitated(),
    };
    const actions = {
      ...this.actions,
    };
    const showLoader = state.gcode.loading || state.gcode.rendering;
    const capable = {
      view3D: WebGL.isWebGLAvailable() && !state.disabled,
    };
    const showDashboard = !capable.view3D && !showLoader;
    const showVisualizer = capable.view3D && !showLoader;
    const showNotifications = showVisualizer && !!state.notification.type;

    return (
      <Widget borderless>
        <Widget.Header className={styles.widgetHeader} fixed>
          <PrimaryToolbar workspaceId={this.workspace.id} state={state} actions={actions} />
        </Widget.Header>
        <Widget.Content className={classNames(styles.widgetContent, { [styles.view3D]: capable.view3D })}>
          {state.gcode.loading && <Loading />}
          {state.gcode.rendering && <Rendering />}
          {state.modal.name === MODAL_WATCH_DIRECTORY && (
            <WatchDirectory workspaceId={this.workspace.id} state={state} actions={actions} />
          )}
          <WorkflowControl workspaceId={this.workspace.id} state={state} actions={actions} />
          <Dashboard workspaceId={this.workspace.id} show={showDashboard} state={state} />
          {WebGL.isWebGLAvailable() && (
            <Visualizer
              workspaceId={this.workspace.id}
              show={showVisualizer}
              cameraPosition={state.cameraPosition}
              ref={this.visualizerRef}
              state={state}
            />
          )}
          {showNotifications && (
            <Notifications
              show={showNotifications}
              type={state.notification.type}
              data={state.notification.data}
              onDismiss={actions.dismissNotification}
            />
          )}
        </Widget.Content>
        <Widget.Footer className={styles.widgetFooter}>
          <SecondaryToolbar
            workspaceId={this.workspace.id}
            is3DView={capable.view3D}
            cameraMode={state.cameraMode}
            cameraPosition={state.cameraPosition}
            camera={actions.camera}
          />
        </Widget.Footer>
      </Widget>
    );
  }
}

export default VisualizerWidget;
