/* eslint-disable */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Space from 'app/components/Space';
import Widget from 'app/components/Widget';
import WidgetConfig from '../WidgetConfig';
import controller from 'app/lib/controller';
import i18n from 'app/lib/i18n';
import {
    M2
} from '../../constants';
import M2Modal from './M2Modal';
import styles from './index.styl';


class M2Widget extends PureComponent {
    static propTypes = {
        widgetId: PropTypes.string.isRequired,
        onFork: PropTypes.func.isRequired,
        onRemove: PropTypes.func.isRequired,
        sortable: PropTypes.object
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
                isFullscreen: !state.isFullscreen,
               
            }));
        },
        toggleMinimized: () => {
            this.setState(state => ({
                minimized: !state.minimized
            }))
        },
        handleCalibrate: () => {
            console.log('calibrating');
        }
    };

    controllerEvents = {
        'serialport:open': (options) => {
            const { port, controllerType } = options;
            this.setState({
                isReady: controllerType === M2,
                port: port
            });
        },
        'serialport:close': (options) => {
            const initialState = this.getInitialState();
            this.setState({ ...initialState });
        },
        'controller:settings': (type, controllerSettings) => {
            if (type === M2) {
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
            if (type === M2) {
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
        const {
            minimized
        } = this.state;

        this.config.set('minimized', minimized);
    }

    getInitialState() {
        return {
            minimized: this.config.get('minimized', false),
            isFullscreen: false,
            port: controller.port,
            // isReady: (controller.loadedControllers.length === 1) || (controller.type === GRBL),
            isReady:true,
            height:"10000.400",
            width:"10000.400",
            distance:"10000.400",
            offset:"10000.400",
            xScaling:"10000.400",
            yScaling:"10000.400",
            zScaling:"10000.400"
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


    render(){
        const { widgetId } = this.props;
        const { 
            minimized, 
            isFullscreen, 
            isReady, 
            height, 
            width,
            distance, 
            offset, 
            xScaling, 
            yScaling, 
            zScaling 
        } = this.state;
        const isForkedWidget = widgetId.match(/\w+:[\w\-]+/);
        const state = {
            ...this.state
        };
        const actions = {
            ...this.actions
        };

    return (
    <Widget fullscreen={false}>
        <Widget.Header>
            <Widget.Title>
            <Widget.Sortable className={this.props.sortable.handleClassName}>
                <i className="fa fa-bars" />
                <Space width="8" />
            </Widget.Sortable>
                {isForkedWidget &&
                    <i className="fa fa-code-fork" style={{ marginRight: 5 }} />
                }
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
                    onSelect={(eventKey) => {
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
            <div className={classnames(styles['widget-container'])} style={{ marginTop:'10px`'}}>
                <p>Height: <span>{height} mm</span></p>
                <p>Width: <span>{width} mm</span></p>
            </div>
            <div className={classnames(styles['widget-header'])}>Calibration</div>
            <div className={classnames(styles['widget-container'])} 
            style={{ flexDirection: 'column', justifyContent:'flex-start', marginTop:'10px' }}
            >
                <p style={{marginBottom:'7px'}}>Distance between motors: <span>{distance} mm</span></p>
                <p style={{marginBottom:'7px'}}>Motor offset: <span>{offset} mm</span></p>
                <p>X Scaling: <span>{xScaling} Steps/mm</span></p>
                <p>Y Scaling: <span>{yScaling} Steps/mm</span></p>
                <p>Z Scaling: <span>{zScaling} Steps/mm</span></p>
            </div>
            <button
                type="button"
                className={classnames("btn btn-primary", styles['widget-button'])}
                onClick={actions.handleCalibrate}
            >
                {i18n._('Calibrate')}
            </button>
            {/* <M2Modal 
                height={height} 
                width={width} 
                distance={distance} 
                offset={offset} 
                xScaling={xScaling} 
                yScaling={yScaling} 
                zScaling={zScaling} 
                setValue={(e) => this.setState({[e.target.name] :e.target.value})}
            /> */}
            </Widget.Content>
        )}
    </Widget>
  )
}
};

export default M2Widget;