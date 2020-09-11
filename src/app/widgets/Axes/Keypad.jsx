import cx from 'classnames';
import ensureArray from 'ensure-array';
import frac from 'frac';
import _includes from 'lodash/includes';
import _uniqueId from 'lodash/uniqueId';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Repeatable from 'react-repeatable';
import styled from 'styled-components';
import { Button } from 'app/components/Buttons';
import Dropdown, { MenuItem } from 'app/components/Dropdown';
import Space from 'app/components/Space';
import Workspaces from 'app/lib/workspaces';
import i18n from 'app/lib/i18n';
import Fraction from './components/Fraction';
import {
    IMPERIAL_UNITS,
    IMPERIAL_STEPS,
    METRIC_UNITS,
    METRIC_STEPS
} from '../../constants';
import styles from './index.styl';

const KeypadText = styled.span`
    position: relative;
    display: inline-block;
    vertical-align: baseline;
`;

class Keypad extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        canClick: PropTypes.bool,
        units: PropTypes.oneOf([IMPERIAL_UNITS, METRIC_UNITS]),
        axes: PropTypes.array,
        jog: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    handleSelect = (eventKey) => {
        const commands = ensureArray(eventKey);
        commands.forEach(command => this.workspace.controller.command('gcode', command));
    };

    renderRationalNumberWithBoundedDenominator(value) {
        // https://github.com/SheetJS/frac
        const denominatorDigits = 4;
        const maximumDenominator = Math.pow(10, Number(denominatorDigits) || 0) - 1; // 10^4 - 1 = 9999
        const [quot, numerator, denominator] = frac(value, maximumDenominator, true);

        if (numerator > 0) {
            return (
                <span>
                    {quot > 0 ? quot : ''}
                    <Space width="2" />
                    <Fraction
                        numerator={numerator}
                        denominator={denominator}
                    />
                </span>
            );
        }

        return (
            <span>{quot > 0 ? quot : ''}</span>
        );
    }

    renderImperialMenuItems() {
        const { jog } = this.props;
        const imperialJogDistances = ensureArray(jog.imperial.distances);
        const imperialJogSteps = [
            ...imperialJogDistances,
            ...IMPERIAL_STEPS
        ];
        const step = jog.imperial.step;

        return imperialJogSteps.map((value, key) => {
            const active = (key === step);

            return (
                <MenuItem
                    key={_uniqueId()}
                    eventKey={key}
                    active={active}
                >
                    {value}
                    <Space width="4" />
                    <sub>{i18n._('in')}</sub>
                </MenuItem>
            );
        });
    }

    renderMetricMenuItems() {
        const { jog } = this.props;
        const metricJogDistances = ensureArray(jog.metric.distances);
        const metricJogSteps = [
            ...metricJogDistances,
            ...METRIC_STEPS
        ];
        const step = jog.metric.step;

        return metricJogSteps.map((value, key) => {
            const active = (key === step);

            return (
                <MenuItem
                    key={_uniqueId()}
                    eventKey={key}
                    active={active}
                >
                    {value}
                    <Space width="4" />
                    <sub>{i18n._('mm')}</sub>
                </MenuItem>
            );
        });
    }

    render() {
        const { canClick, units, axes, jog, actions } = this.props;
        const canChangeUnits = canClick;
        const canChangeStep = canClick;
        const imperialJogDistances = ensureArray(jog.imperial.distances);
        const metricJogDistances = ensureArray(jog.metric.distances);
        const imperialJogSteps = [
            ...imperialJogDistances,
            ...IMPERIAL_STEPS
        ];
        const metricJogSteps = [
            ...metricJogDistances,
            ...METRIC_STEPS
        ];
        const canStepForward = canChangeStep && (
            (units === IMPERIAL_UNITS && (jog.imperial.step < imperialJogSteps.length - 1)) ||
            (units === METRIC_UNITS && (jog.metric.step < metricJogSteps.length - 1))
        );
        const canStepBackward = canChangeStep && (
            (units === IMPERIAL_UNITS && (jog.imperial.step > 0)) ||
            (units === METRIC_UNITS && (jog.metric.step > 0))
        );
        const canClickX = canClick && _includes(axes, 'x');
        const canClickY = canClick && _includes(axes, 'y');
        const canClickXY = canClickX && canClickY;
        const canClickZ = canClick && _includes(axes, 'z');
        const highlightX = canClickX && (jog.keypad || jog.axis === 'x');
        const highlightY = canClickY && (jog.keypad || jog.axis === 'y');
        const highlightZ = canClickZ && (jog.keypad || jog.axis === 'z');

        return (
            <div className={styles.keypad}>
                <div className="row no-gutters">
                    <div className="col-xs-8">
                        <div className={styles.rowSpace}>
                            <div className="row no-gutters">
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-xy'],
                                                { [styles.highlight]: highlightY }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: -distance, Y: distance });
                                            }}
                                            disabled={!canClickXY}
                                            title={i18n._('Move machine left & up')}
                                        >
                                            <i className={cx('fa', 'fa-arrow-circle-up', styles['rotate--45deg'])} style={{ fontSize: 16 }} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-xy'],
                                                { [styles.highlight]: highlightY }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ Y: distance });
                                            }}
                                            disabled={!canClickY}
                                            title={i18n._('Move machine up')}
                                        >
                                            <KeypadText>Y</KeypadText>
                                            <i className="fa fa-arrow-up" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-xy'])}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: distance, Y: distance });
                                            }}
                                            disabled={!canClickXY}
                                            title={i18n._('Move machine right & up')}
                                        >
                                            <i className={cx('fa', 'fa-arrow-circle-up', styles['rotate-45deg'])} style={{ fontSize: 16 }} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-z'],
                                                { [styles.highlight]: highlightZ }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ Z: distance });
                                            }}
                                            disabled={!canClickZ}
                                            title={i18n._('Raise bit')}
                                        >
                                            <KeypadText>Z</KeypadText>
                                            <i className="fa fa-arrow-up" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rowSpace}>
                            <div className="row no-gutters">
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-xy'],
                                                { [styles.highlight]: highlightX }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: -distance });
                                            }}
                                            disabled={!canClickX}
                                            title={i18n._('Move machine left')}
                                        >
                                            <i className="fa fa-arrow-left" />
                                            <KeypadText>X</KeypadText>
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-xy'])}
                                            onClick={() => actions.move({ X: 0, Y: 0 })}
                                            disabled={!canClickXY}
                                            title={i18n._('Move machine to 0/0')}
                                        >
                                            <i className="fa fa-crosshairs" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-xy'],
                                                { [styles.highlight]: highlightX }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: distance });
                                            }}
                                            disabled={!canClickX}
                                            title={i18n._('Move machine right')}
                                        >
                                            <KeypadText>X</KeypadText>
                                            <i className="fa fa-arrow-right" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-z'])}
                                            onClick={() => actions.move({ Z: 0 })}
                                            disabled={!canClickZ}
                                            title={i18n._('Move bit to zero')}
                                        >
                                            <i className="fa fa-crosshairs" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rowSpace}>
                            <div className="row no-gutters">
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-xy'])}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: -distance, Y: -distance });
                                            }}
                                            disabled={!canClickXY}
                                            title={i18n._('Move machine left & down')}
                                        >
                                            <i className={cx('fa', 'fa-arrow-circle-down', styles['rotate-45deg'])} style={{ fontSize: 16 }} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(
                                                styles.btnKeypad, styles['btn-xy'],
                                                { [styles.highlight]: highlightY }
                                            )}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ Y: -distance });
                                            }}
                                            disabled={!canClickY}
                                            title={i18n._('Move machine down')}
                                        >
                                            <KeypadText>Y</KeypadText>
                                            <i className="fa fa-arrow-down" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-xy'])}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ X: distance, Y: -distance });
                                            }}
                                            disabled={!canClickXY}
                                            title={i18n._('Move machine right & down')}
                                        >
                                            <i className={cx('fa', 'fa-arrow-circle-down', styles['rotate--45deg'])} style={{ fontSize: 16 }} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="col-xs-3">
                                    <div className={styles.colSpace}>
                                        <Button
                                            btnStyle="flat"
                                            compact
                                            className={cx(styles.btnKeypad, styles['btn-z'])}
                                            onClick={() => {
                                                const distance = actions.getJogDistance();
                                                actions.jog({ Z: -distance });
                                            }}
                                            disabled={!canClickZ}
                                            title={i18n._('Lower bit')}
                                        >
                                            <KeypadText>Z</KeypadText>
                                            <i className="fa fa-arrow-down" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-4">
                        <div className={styles.rowSpace}>
                            <Dropdown
                                pullRight
                                style={{
                                    width: '100%'
                                }}
                                disabled={!canChangeUnits}
                            >
                                <Dropdown.Toggle
                                    btnStyle="flat"
                                    style={{
                                        textAlign: 'right',
                                        width: '100%'
                                    }}
                                >
                                    {units === IMPERIAL_UNITS && i18n._('G20 (inch)')}
                                    {units === METRIC_UNITS && i18n._('G21 (mm)')}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <MenuItem header>
                                        {i18n._('Units')}
                                    </MenuItem>
                                    <MenuItem
                                        active={units === IMPERIAL_UNITS}
                                        onSelect={() => {
                                            this.workspace.controller.command('gcode', 'G20');
                                        }}
                                    >
                                        {i18n._('G20 (inch)')}
                                    </MenuItem>
                                    <MenuItem
                                        active={units === METRIC_UNITS}
                                        onSelect={() => {
                                            this.workspace.controller.command('gcode', 'G21');
                                        }}
                                    >
                                        {i18n._('G21 (mm)')}
                                    </MenuItem>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className={styles.rowSpace}>
                            {units === IMPERIAL_UNITS && (
                                <Dropdown
                                    pullRight
                                    style={{
                                        width: '100%'
                                    }}
                                    disabled={!canChangeStep}
                                    onSelect={(eventKey) => {
                                        const step = eventKey;
                                        actions.selectStep(step);
                                    }}
                                >
                                    <Dropdown.Toggle
                                        btnStyle="flat"
                                        style={{
                                            textAlign: 'right',
                                            width: '100%'
                                        }}
                                    >
                                        {imperialJogSteps[jog.imperial.step]}
                                        <Space width="4" />
                                        <sub>{i18n._('in')}</sub>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        style={{
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <MenuItem header>
                                            {i18n._('Imperial')}
                                        </MenuItem>
                                        {this.renderImperialMenuItems()}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                            {units === METRIC_UNITS && (
                                <Dropdown
                                    pullRight
                                    style={{
                                        width: '100%'
                                    }}
                                    disabled={!canChangeStep}
                                    onSelect={(eventKey) => {
                                        const step = eventKey;
                                        actions.selectStep(step);
                                    }}
                                >
                                    <Dropdown.Toggle
                                        btnStyle="flat"
                                        style={{
                                            textAlign: 'right',
                                            width: '100%'
                                        }}
                                    >
                                        {metricJogSteps[jog.metric.step]}
                                        <Space width="4" />
                                        <sub>{i18n._('mm')}</sub>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        style={{
                                            maxHeight: 150,
                                            overflowY: 'auto'
                                        }}
                                    >
                                        <MenuItem header>
                                            {i18n._('Metric')}
                                        </MenuItem>
                                        {this.renderMetricMenuItems()}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                        <div className={styles.rowSpace}>
                            <div className="row no-gutters">
                                <div className="col-xs-6">
                                    <Repeatable
                                        disabled={!canStepBackward}
                                        style={{ marginRight: 2.5 }}
                                        repeatDelay={1000}
                                        repeatInterval={Math.floor(1000 / 15)}
                                        onHold={actions.stepBackward}
                                        onRelease={actions.stepBackward}
                                    >
                                        <Button
                                            disabled={!canStepBackward}
                                            style={{ width: '100%' }}
                                            compact
                                            btnStyle="flat"
                                            className="pull-left"
                                        >
                                            <i className="fa fa-minus" />
                                        </Button>
                                    </Repeatable>
                                </div>
                                <div className="col-xs-6">
                                    <Repeatable
                                        disabled={!canStepForward}
                                        style={{ marginLeft: 2.5 }}
                                        repeatDelay={1000}
                                        repeatInterval={Math.floor(1000 / 15)}
                                        onHold={actions.stepForward}
                                        onRelease={actions.stepForward}
                                    >
                                        <Button
                                            disabled={!canStepForward}
                                            style={{ width: '100%' }}
                                            compact
                                            btnStyle="flat"
                                            className="pull-right"
                                        >
                                            <i className="fa fa-plus" />
                                        </Button>
                                    </Repeatable>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Keypad;
