import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import AxesWidget from 'widgets/Axes';
import ConnectionWidget from 'widgets/Connection';
import ConsoleWidget from 'widgets/Console';
import GCodeWidget from 'widgets/GCode';
import GrblWidget from 'widgets/Grbl';
import LaserWidget from 'widgets/Laser';
import MarlinWidget from 'widgets/Marlin';
import ProbeWidget from 'widgets/Probe';
import SpindleWidget from 'widgets/Spindle';
import CustomWidget from 'widgets/Custom';
import TinyGWidget from 'widgets/TinyG';
import MaslowWidget from 'widgets/Maslow';
import VisualizerWidget from 'widgets/Visualizer';
import WebcamWidget from 'widgets/Webcam';

const getWidgetByName = (name) => {
    return {
        'axes': AxesWidget,
        'connection': ConnectionWidget,
        'console': ConsoleWidget,
        'gcode': GCodeWidget,
        'grbl': GrblWidget,
        'laser': LaserWidget,
        'marlin': MarlinWidget,
        'probe': ProbeWidget,
        'spindle': SpindleWidget,
        'custom': CustomWidget,
        'tinyg': TinyGWidget,
        'maslow': MaslowWidget,
        'visualizer': VisualizerWidget,
        'webcam': WebcamWidget,
    }[name] || null;
};

class WidgetWrapper extends PureComponent {
    widget = null;

    render() {
        const { widgetId } = this.props;

        if (typeof widgetId !== 'string') {
            return null;
        }

        const name = widgetId.split(':')[0];
        const Widget = getWidgetByName(name);

        if (!Widget) {
            return null;
        }

        return (
            <Widget
                {...this.props}
                ref={node => {
                    this.widget = node;
                }}
            />
        );
    }
}

WidgetWrapper.propTypes = {
    workspaceId: PropTypes.string.isRequired,
    widgetId: PropTypes.string.isRequired,
};

export default WidgetWrapper;
