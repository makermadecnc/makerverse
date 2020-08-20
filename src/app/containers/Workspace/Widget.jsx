import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import AxesWidget from 'app/widgets/Axes';
import ConnectionWidget from 'app/widgets/Connection';
import ConsoleWidget from 'app/widgets/Console';
import GCodeWidget from 'app/widgets/GCode';
import GrblWidget from 'app/widgets/Grbl';
import LaserWidget from 'app/widgets/Laser';
import MarlinWidget from 'app/widgets/Marlin';
import ProbeWidget from 'app/widgets/Probe';
import SpindleWidget from 'app/widgets/Spindle';
import CustomWidget from 'app/widgets/Custom';
import TinyGWidget from 'app/widgets/TinyG';
import MaslowWidget from 'app/widgets/Maslow';
import VisualizerWidget from 'app/widgets/Visualizer';
import WebcamWidget from 'app/widgets/Webcam';

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
