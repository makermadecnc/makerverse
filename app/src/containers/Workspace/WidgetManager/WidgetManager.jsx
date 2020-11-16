import difference from 'lodash/difference';
import find from 'lodash/find';
import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Modal from 'components/Modal';
import i18n from 'lib/i18n';
import Workspaces from 'lib/workspaces';
import WidgetList from './WidgetList';

class WidgetManager extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        onSave: PropTypes.func,
        onClose: PropTypes.func.isRequired
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    state = {
        show: true
    };

    widgetList = [
        {
            id: 'axes',
            caption: i18n._('Controls Widget'),
            details: i18n._('This widget shows the XYZ position. It includes jog controls, homing, and axis zeroing.'),
            visible: true,
            disabled: false
        },
        {
            id: 'gcode',
            caption: i18n._('G-code Widget'),
            details: i18n._('This widget shows the current status of G-code commands.'),
            visible: true,
            disabled: false
        },
        {
            id: 'laser',
            caption: i18n._('Laser Widget'),
            details: i18n._('This widget allows you control laser intensity and turn the laser on/off.'),
            visible: true,
            disabled: false
        },
        {
            id: 'probe',
            caption: i18n._('Probe Widget'),
            details: i18n._('This widget helps you use a touch plate to set your Z zero offset.'),
            visible: true,
            disabled: false
        },
        {
            id: 'spindle',
            caption: i18n._('Spindle Widget'),
            details: i18n._('This widget provides the spindle control.'),
            visible: true,
            disabled: false
        },
        {
            id: 'webcam',
            caption: i18n._('Webcam Widget'),
            details: i18n._('View a webcam from within the app to monitor progress.'),
            visible: true,
            disabled: false
        }
    ];

    handleSave = () => {
        this.setState({ show: false });

        const allWidgets = this.widgetList.map(item => item.id);
        const activeWidgets = this.widgetList
            .filter(item => item.visible)
            .map(item => item.id);
        const inactiveWidgets = difference(allWidgets, activeWidgets);

        this.props.onSave(activeWidgets, inactiveWidgets);
    };

    handleCancel = () => {
        this.setState({ show: false });
    };

    componentDidUpdate() {
        if (!(this.state.show)) {
            this.props.onClose();
        }
    }

    render() {
        const activeWidgets = this.workspace.activeWidgetTypes;

        this.widgetList.forEach(widget => {
            if (includes(activeWidgets, widget.id)) {
                widget.visible = true;
            } else {
                widget.visible = false;
            }
        });

        return (
            <Modal
                size="md"
                onClose={this.handleCancel}
                show={this.state.show}
            >
                <Modal.Header>
                    <Modal.Title>{i18n._('Widgets')}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    <WidgetList
                        list={this.widgetList}
                        onChange={(id, checked) => {
                            const o = find(this.widgetList, { id: id });
                            if (o) {
                                o.visible = checked;
                            }
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-default"
                        onClick={this.handleCancel}
                    >
                        {i18n._('Cancel')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.handleSave}
                    >
                        {i18n._('OK')}
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default WidgetManager;
