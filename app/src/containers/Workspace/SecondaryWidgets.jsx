import chainedFunction from 'chained-function';
import log from 'js-logger';
import classNames from 'classnames';
import ensureArray from 'ensure-array';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import pubsub from 'pubsub-js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Sortable from 'react-sortablejs';
import { v4 as uuid } from 'uuid';
import { Button } from 'components/Buttons';
import Modal from 'components/Modal';
import i18n from 'lib/i18n';
import portal from 'lib/portal';
import store from 'store';
import Widget from './Widget';
import styles from './widgets.styl';
import Workspaces from '../../lib/workspaces';

class SecondaryWidgets extends Component {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        onForkWidget: PropTypes.func.isRequired,
        onRemoveWidget: PropTypes.func.isRequired,
        onDragStart: PropTypes.func.isRequired,
        onDragEnd: PropTypes.func.isRequired
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    state = {
        widgets: this.workspace.secondaryWidgets
    };

    forkWidget = (widgetId) => () => {
        portal(({ onClose }) => (
            <Modal size="xs" onClose={onClose}>
                <Modal.Header>
                    <Modal.Title>
                        {i18n._('Fork Widget')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {i18n._('Are you sure you want to fork this widget?')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onClose}
                    >
                        {i18n._('Cancel')}
                    </Button>
                    <Button
                        btnStyle="primary"
                        onClick={chainedFunction(
                            () => {
                                const name = widgetId.split(':')[0];
                                if (!name) {
                                    log.error(`Failed to fork widget: widgetId=${widgetId}`);
                                    return;
                                }

                                // Use the same widget settings in a new widget
                                const forkedWidgetId = `${name}:${uuid()}`;
                                const defaultSettings = store.get(`widgets["${name}"]`);
                                const clonedSettings = store.get(`widgets["${widgetId}"]`, defaultSettings);
                                store.set(`widgets["${forkedWidgetId}"]`, clonedSettings);

                                const widgets = [...this.state.widgets, forkedWidgetId];
                                this.setState({ widgets: widgets });

                                this.props.onForkWidget(widgetId);
                            },
                            onClose
                        )}
                    >
                        {i18n._('OK')}
                    </Button>
                </Modal.Footer>
            </Modal>
        ));
    };

    removeWidget = (widgetId) => () => {
        portal(({ onClose }) => (
            <Modal size="xs" onClose={onClose}>
                <Modal.Header>
                    <Modal.Title>
                        {i18n._('Remove Widget')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {i18n._('Are you sure you want to remove this widget?')}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onClose}
                    >
                        {i18n._('Cancel')}
                    </Button>
                    <Button
                        btnStyle="primary"
                        onClick={chainedFunction(
                            () => {
                                const widgets = this.state.widgets.filter(n => n !== widgetId);
                                this.setState({ widgets: widgets });

                                if (widgetId.match(/\w+:[\w\-]+/)) {
                                    // Remove forked widget settings
                                    store.unset(`widgets["${widgetId}"]`);
                                }

                                this.props.onRemoveWidget(widgetId);
                            },
                            onClose
                        )}
                    >
                        {i18n._('OK')}
                    </Button>
                </Modal.Footer>
            </Modal>
        ));
    };

    pubsubTokens = [];

    widgetMap = {};

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.unsubscribe();
    }


    shouldComponentUpdate(nextProps, nextState) {
        // Do not compare props for performance considerations
        return !isEqual(nextState, this.state);
    }

    componentDidUpdate() {
        const { widgets } = this.state;
        this.workspace.secondaryWidgets = widgets;
    }

    subscribe() {
        { // updateSecondaryWidgets
            const token = pubsub.subscribe('updateSecondaryWidgets', (msg, widgets) => {
                this.setState({ widgets: widgets });
            });
            this.pubsubTokens.push(token);
        }
    }

    unsubscribe() {
        this.pubsubTokens.forEach((token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }

    expandAll() {
        const len = this.state.widgets.length;
        for (let i = 0; i < len; ++i) {
            const widget = this.widgetMap[this.state.widgets[i]];
            const expand = get(widget, 'expand');
            if (typeof expand === 'function') {
                expand();
            }
        }
    }

    collapseAll() {
        const len = this.state.widgets.length;
        for (let i = 0; i < len; ++i) {
            const widget = this.widgetMap[this.state.widgets[i]];
            const collapse = get(widget, 'collapse');
            if (typeof collapse === 'function') {
                collapse();
            }
        }
    }

    render() {
        const { className } = this.props;
        const widgets = this.state.widgets
            .map(widgetId => (
                <div data-widget-id={widgetId} key={widgetId}>
                    <Widget
                        ref={node => {
                            if (node && node.widget) {
                                this.widgetMap[widgetId] = node.widget;
                            }
                        }}
                        workspaceId={this.workspace.id}
                        widgetId={widgetId}
                        onFork={this.forkWidget(widgetId)}
                        onRemove={this.removeWidget(widgetId)}
                        sortable={{
                            handleClassName: 'sortable-handle',
                            filterClassName: 'sortable-filter'
                        }}
                    />
                </div>
            ));
        return (
            <Sortable
                className={classNames(className, styles.widgets)}
                options={{
                    animation: 150,
                    delay: 0, // Touch and hold delay
                    group: {
                        name: 'secondary',
                        pull: true,
                        put: ['primary']
                    },
                    handle: '.sortable-handle', // Drag handle selector within list items
                    filter: '.sortable-filter', // Selectors that do not lead to dragging
                    chosenClass: 'sortable-chosen', // Class name for the chosen item
                    ghostClass: 'sortable-ghost', // Class name for the drop placeholder
                    dataIdAttr: 'data-widget-id',
                    onStart: this.props.onDragStart,
                    onEnd: this.props.onDragEnd
                }}
                onChange={(order) => {
                    this.setState({ widgets: ensureArray(order) });
                }}
            >
                {widgets}
            </Sortable>
        );
    }
}

export default SecondaryWidgets;
