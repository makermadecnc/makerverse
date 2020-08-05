/* eslint-disable */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
import WidgetConfig from '../WidgetConfig';
import controller from 'app/lib/controller';
import i18n from 'app/lib/i18n';
import get from 'lodash/get';
import includes from 'lodash/includes';
import { in2mm } from 'app/lib/units';
import {
  GRBL,
  GRBL_ACTIVE_STATE_IDLE,
  GRBL_ACTIVE_STATE_RUN
} from '../../constants';

import M2Modal from './M2Modal';
import M2ScaleModal from './M2ScaleModal';
import styles from './index.styl';

class M2Widget extends PureComponent {
  static propTypes = {
    widgetId: PropTypes.string.isRequired,
    onFork: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    sortable: PropTypes.object,
    state: PropTypes.object
  };
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
      this.setState(state => ({
        minimized: state.isFullscreen ? state.minimized : false,
        isFullscreen: !state.isFullscreen
      }));
    },
    toggleMinimized: () => {
      this.setState(state => ({
        minimized: !state.minimized
      }));
    },
    handleCalibrate: values => {
      this.setState({ displayModal: false, pendingValues: values });
      for (const [key, value] of Object.entries(values)) {
        const val = value.units === 'mm' ? value.value : in2mm(value.value);
        controller.command('gcode', `${key}=${val}`);
      }
    }
  };

  controllerEvents = {
    'serialport:open': options => {
      const { port, controllerType } = options;
      this.setState({
        isReady: controllerType === GRBL,
        port: port
      });
    },
    'serialport:close': options => {
      const initialState = this.getInitialState();
      this.setState({ ...initialState });
    },
    'serialport:read': options => {
      const { pendingValues } = this.state;
      if (
        Object.keys(pendingValues).length !== 0 &&
        pendingValues.constructor === Object
      ) {
        const prevSettings = { ...this.state.controller };
        for (const [key, value] of Object.entries(this.state.pendingValues)) {
          const val = value.units === 'mm' ? value.value : in2mm(value.value);
          prevSettings.settings.settings[key] = val.toFixed(3);
        }
        this.setState({ controller: prevSettings, pendingValues: {} });
      }
    },
    'controller:settings': (type, controllerSettings) => {
      if (type === GRBL) {
        this.setState(state => ({
          controller: {
            ...state.controller,
            type: type,
            settings: controllerSettings
          }
        }));
      }
    },
    'controller:state': (type, controllerState) => {
      if (type === GRBL) {
        this.setState(state => ({
          controller: {
            ...state.controller,
            type: type,
            state: controllerState
          }
        }));
      }
    }
  };

  componentDidMount() {
    this.addControllerEvents();
  }

  componentWillUnmount() {
    this.removeControllerEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    const { minimized } = this.state;

    this.config.set('minimized', minimized);
  }

  getInitialState() {
    return {
      minimized: this.config.get('minimized', false),
      isFullscreen: false,
      port: controller.port,
      canClick: true,
      isReady:
        controller.loadedControllers.length === 1 || controller.type === GRBL,
      displayModal: false,
      pendingValues: {},
      modalType: 'scale',
      modalImg: '../images/calibration_modal_img_1.png',
      modalConfig: [],
      controller: {
        type: controller.type,
        settings: controller.settings,
        state: controller.state
      }
    };
  }

  addControllerEvents() {
    Object.keys(this.controllerEvents).forEach(eventName => {
      const callback = this.controllerEvents[eventName];
      controller.addListener(eventName, callback);
    });
  }

  removeControllerEvents() {
    Object.keys(this.controllerEvents).forEach(eventName => {
      const callback = this.controllerEvents[eventName];
      controller.removeListener(eventName, callback);
    });
  }
  canClick() {
    const controllerType = this.state.controller.type;
    const controllerState = this.state.controller.state;
    const activeState = get(controllerState, 'status.activeState');
    const states = [GRBL_ACTIVE_STATE_IDLE, GRBL_ACTIVE_STATE_RUN];
    if (!includes(states, activeState)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { widgetId } = this.props;
    const {
      minimized,
      isFullscreen,
      isReady,
      displayModal,
      modalImg,
      modalConfig,
      modalType
    } = this.state;
    const isForkedWidget = widgetId.match(/\w+:[\w\-]+/);
    const state = {
      ...this.state,
      canClick: this.canClick()
    };
    const actions = {
      ...this.actions
    };
    console.log(state.controller.settings.settings);
    return (
      <Widget fullscreen={false}>
        <Widget.Header>
          <Widget.Title>
            <Widget.Sortable className={this.props.sortable.handleClassName}>
              <i className="fa fa-bars" />
              <Space width="8" />
            </Widget.Sortable>
            {isForkedWidget && (
              <i className="fa fa-code-fork" style={{ marginRight: 5 }} />
            )}
            M2 Configuration
          </Widget.Title>
          <Widget.Controls className={this.props.sortable.filterClassName}>
            {isReady && (
              <Widget.Button
                disabled={isFullscreen}
                title={minimized ? i18n._('Expand') : i18n._('Collapse')}
                onClick={actions.toggleMinimized}
              >
                <i
                  className={classnames(
                    'fa',
                    { 'fa-chevron-up': !minimized },
                    { 'fa-chevron-down': minimized }
                  )}
                />
              </Widget.Button>
            )}
            <Widget.DropdownButton
              title={i18n._('More')}
              toggle={<i className="fa fa-ellipsis-v" />}
              onSelect={eventKey => {
                if (eventKey === 'fork') {
                  this.props.onFork();
                } else if (eventKey === 'remove') {
                  this.props.onRemove();
                }
              }}
            >
              <Widget.DropdownMenuItem eventKey="fork">
                <i className="fa fa-fw fa-code-fork" />
                <Space width="4" />
                {i18n._('Fork Widget')}
              </Widget.DropdownMenuItem>
              <Widget.DropdownMenuItem eventKey="remove">
                <i className="fa fa-fw fa-times" />
                <Space width="4" />
                {i18n._('Remove Widget')}
              </Widget.DropdownMenuItem>
            </Widget.DropdownButton>
          </Widget.Controls>
        </Widget.Header>
        {isReady && (
          <Widget.Content
            className={classnames(
              styles['widget-content'],
              { [styles.hidden]: minimized },
              { [styles.fullscreen]: isFullscreen }
            )}
          >
            <div className={classnames(styles['widget-header'])}>Workspace</div>
            <div
              className={classnames(styles['widget-container'])}
              style={{
                marginTop: '10px',
                flexDirection: 'column',
                justifyContent: 'flex-start'
              }}
            >
              <p>
                Height:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$82}{' '}
                  mm
                </span>
              </p>
              <p>
                Width:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$81}{' '}
                  mm
                </span>
              </p>
            </div>
            <button
              type="button"
              disabled={!state.canClick}
              className={classnames('btn btn-warning', styles['widget-button'])}
              onClick={() => {
                this.setState({
                  displayModal: true,
                  modalImg: '../../images/calibration_dimensions.png',
                  modalConfig: [
                    {
                      name: 'Height',
                      gCode: '$82',
                      for: 'height'
                    },
                    { name: 'Width', gCode: '$81', for: 'width' }
                  ],
                  modalType: 'default'
                });
              }}
            >
              {i18n._('Change Size')}
            </button>
            <div className={classnames(styles['widget-header'])}>
              Machine Settings
            </div>
            <div
              className={classnames(styles['widget-container'])}
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                marginTop: '10px'
              }}
            >
              <p style={{ marginBottom: '7px' }}>
                Distance between motors:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$83}{' '}
                  mm
                </span>
              </p>
              <p style={{ marginBottom: '7px' }}>
                Motor offset:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$84}{' '}
                  mm
                </span>
              </p>
            </div>
            <button
              type="button"
              className={classnames('btn btn-warning', styles['widget-button'])}
              disabled={!state.canClick}
              onClick={() => {
                this.setState({
                  displayModal: true,
                  modalImg: '../../images/calibration_motor.png',
                  modalConfig: [
                    {
                      name: 'Distance between motors',
                      gCode: '$83',
                      for: 'distance'
                    },
                    { name: 'Motor offset', gCode: '$84', for: 'offset' }
                  ],
                  modalType: 'default'
                });
              }}
            >
              {i18n._('Edit')}
            </button>
            <div className={classnames(styles['widget-header'])}>
              Configuration
            </div>
            <div
              className={classnames(styles['widget-container'])}
              style={{
                flexDirection: 'column',
                justifyContent: 'flex-start',
                marginTop: '10px'
              }}
            >
              <p>
                X Scaling:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$85}{' '}
                </span>
              </p>
              <p>
                Y Scaling:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$86}{' '}
                </span>
              </p>
              <p>
                Z Scaling:{' '}
                <span>
                  {state.controller.settings.settings &&
                    state.controller.settings.settings.$102}{' '}
                  Steps/mm
                </span>
              </p>
            </div>
            <button
              type="button"
              className={classnames('btn btn-warning', styles['widget-button'])}
              disabled={!state.canClick}
              onClick={() => {
                this.setState({
                  displayModal: true,
                  modalConfig: [
                    {
                      name: 'X Scaling',
                      gCode: '$85',
                      for: 'xScaling',
                      img: '../../images/calibration_x.png',
                      dimension: 'Width'
                    },
                    {
                      name: 'Y Scaling',
                      gCode: '$86',
                      for: 'yScaling',
                      img: '../../images/calibration_y.png',
                      dimension: 'Height'
                    },
                    {
                      name: 'Z Scaling',
                      gCode: '$102',
                      for: 'zScaling',
                      img: '../../images/calibration_z.png',
                      dimension: 'Distance'
                    }
                  ],
                  modalType: 'scale'
                });
              }}
            >
              {i18n._('Calibrate')}
            </button>
            {displayModal &&
              (modalType === 'scale' ? (
                <M2ScaleModal
                  modalConfig={modalConfig}
                  handleCalibrate={actions.handleCalibrate}
                  controllerSettings={state.controller.settings.settings}
                  handleClose={() => this.setState({ displayModal: false })}
                />
              ) : (
                <M2Modal
                  modalImg={modalImg}
                  modalConfig={modalConfig}
                  handleCalibrate={actions.handleCalibrate}
                  controllerSettings={state.controller.settings.settings}
                  handleClose={() => this.setState({ displayModal: false })}
                />
              ))}
          </Widget.Content>
        )}
      </Widget>
    );
  }
}

export default M2Widget;
