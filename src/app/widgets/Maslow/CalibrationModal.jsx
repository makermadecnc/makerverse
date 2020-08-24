import _ from 'lodash';
import PropTypes from 'prop-types';
import log from 'app/lib/log';
import React, { PureComponent } from 'react';
import { Button } from 'app/components/Buttons';
import Modal from 'app/components/Modal';
import { Nav, NavItem } from 'app/components/Navs';
import i18n from 'app/lib/i18n';
import Workspaces from 'app/lib/workspaces';
import MaslowCalibration from 'app/lib/Maslow/MaslowCalibration';
import styles from './index.styl';

const defaultMeasurements = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
};

class CalibrationModal extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    calibration = new MaslowCalibration(this.workspace.controller, {
        measuredInches: this.workspace.isImperialUnits
    });

    fromMM(mm, inches = this.state.measuredInches) {
        return Math.round((inches ? (Number(mm) / 25.4) : Number(mm)) * 100) / 100;
    }

    toMM(mm, inches = this.state.measuredInches) {
        return Math.round((inches ? (Number(mm) * 25.4) : Number(mm)) * 100) / 100;
    }

    get internalState() {
        const inches = this.calibration.opts.measuredInches;
        return {
            cutDepth: this.fromMM(this.calibration.opts.cutDepth, inches), // mm to cut in the calibration pattern (zero = no cutting)
            cutHoles: this.calibration.opts.cutHoles,
            measuredInches: inches,
            edgeDistance: this.fromMM(this.calibration.opts.edgeDistance, inches),
            machineWidth: this.fromMM(this.calibration.kin.opts.machineWidth, inches),
            machineHeight: this.fromMM(this.calibration.kin.opts.machineHeight, inches),
            origChainLength: this.fromMM(this.calibration.kin.opts.origChainLength, inches),
            motorOffsetY: this.fromMM(this.calibration.kin.opts.motorOffsetY, inches),
            distBetweenMotors: this.fromMM(this.calibration.kin.opts.distBetweenMotors, inches),
            sledRadius: this.fromMM(this.calibration.opts.sledRadius, inches),
        };
    }

    state = {
        ...this.internalState,
        measurements: defaultMeasurements,
        activeTab: 'machine',
        yHome: 0,
        calibrating: -1,
        result: false,
        applied: false
    };

    handleMeasurement(idx, val) {
        this.setState({ measurements: { ...this.state.measurements, [idx]: val } });
    }

    updateCalibrationResults(percent) {
        this.setState({ calibrating: percent });
    }

    calibrate() {
        const input = this.state.measurements;
        const measurements = Object.keys(input).map((i) => {
            return Number(input[i]);
        });
        this.calibration.opts.cutDepth = this.state.cutDepth;
        this.calibration.recomputeIdeals();
        this.setState({ calibrating: 0, result: false });
        // Let the UI update before beginning this long operation...
        setTimeout(() => {
            const res = this.calibration.calibrate(measurements, this.updateCalibrationResults.bind(this));
            this.setState({ result: res, calibrating: -1 });
        }, 10);
    }

    applyResults() {
        const settings = this.calibration.kin.getSettingsMap();
        const sks = Object.keys(settings);
        const result = this.state.result;
        this.workspace.controller.command('gcode', '$X');
        Object.keys(result.optimized).forEach((k) => {
            if (!sks.includes(k)) {
                return;
            }
            const name = settings[k].name;
            const val = result.optimized[k];
            const cmd = `${name}=${val}`;
            this.workspace.controller.writeln(cmd);
        });
        this.setState({ ...this.state, applied: true });
    }

    updateKinematics(opts) {
        this.calibration.kin.recomputeGeometry(opts);
        log.debug('kinematics', this.calibration.kin.opts);
    }

    updateCalibrationOpts(opts) {
        this.calibration.update(opts);
        log.debug('calibration', this.calibration.opts);
    }

    moveToPosition(index) {
        const gcode = this.calibration.generateGcodePoint(index);
        log.debug(`Moving to position ${index}`);
        gcode.forEach((cmd) => {
            this.workspace.controller.writeln(cmd);
        });
        if (this.state.measuredInches) {
            this.workspace.controller.command('gcode', 'G20');
        }
    }

    writeSetting(name, value) {
        const setting = this.calibration.kin.getSettingsMap()[name];
        this.workspace.controller.writeln(`${setting.name}=${value}`);
    }

    defineHome(opts) {
        const chainLengths = this.calibration.kin.positionToChain(0, this.toMM(this.state.yHome));
        this.calibration.kin.opts.origChainLength = Math.round((chainLengths[0] + chainLengths[1]) / 2);
        this.workspace.controller.command('gcode', '$X');
        this.writeSetting('origChainLength', this.calibration.kin.opts.origChainLength);
        this.writeSetting('motorOffsetY', this.calibration.kin.opts.motorOffsetY);
        this.writeSetting('distBetweenMotors', this.calibration.kin.opts.distBetweenMotors);
        this.writeSetting('machineWidth', this.calibration.kin.opts.machineWidth);
        this.writeSetting('machineHeight', this.calibration.kin.opts.machineHeight);
        this.workspace.controller.command('gcode', '$H');
        this.setState({ ...this.state, origChainLength: this.calibration.kin.opts.origChainLength });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const tab = this.state.activeTab;
        if (prevState.activeTab !== tab && ['edge', 'precision'].includes(tab)) {
            this.updateCalibrationOpts({ cutHoles: tab === 'precision' });
        }
    }

    render() {
        const { actions } = this.props;
        const edge = '0%';
        const inset = '10%';
        const btn = '7%';
        const inputPositions = [
            { top: edge, left: '50%', right: '50%' },
            { top: edge, right: inset },
            { top: inset, right: edge },
            { bottom: inset, right: edge },
            { bottom: edge, right: inset },
            { bottom: edge, left: '50%', right: '50%' },
            { bottom: edge, left: inset },
            { bottom: inset, left: edge },
            { top: inset, left: edge },
            { top: edge, left: inset },
        ];
        const buttonPositions = [
            { top: btn, left: btn },
            { top: btn, left: '50%', right: '50%' },
            { top: btn, right: btn },
            { bottom: btn, right: btn },
            { bottom: btn, left: '50%', right: '50%' },
            { bottom: btn, left: btn },
        ];
        const {
            measurements,
            activeTab,
            cutDepth,
            motorOffsetY,
            machineWidth,
            machineHeight,
            distBetweenMotors,
            measuredInches,
            calibrating,
            result,
            edgeDistance,
            sledRadius,
            yHome,
            applied
        } = this.state;
        const isCalibrating = calibrating >= 0;
        const height = Math.max(window.innerHeight / 2, 200);
        const zeroIdx = _.findIndex(Object.keys(measurements), (m) => {
            return measurements[m] <= 0;
        });
        const measurementsValid = zeroIdx < 0;
        const canCalibrate = measurementsValid && !isCalibrating && !applied;
        const isPrecisionTab = activeTab === 'precision';
        const isEdgeTab = activeTab === 'edge';
        const isCalibrationTab = isPrecisionTab || isEdgeTab;
        const isImperial = !!measuredInches;
        const units = isImperial ? 'in' : 'mm';

        return (
            <Modal disableOverlay size="lg" onClose={actions.closeModal}>
                <Modal.Header>
                    <Modal.Title>
                        Maslow Calibration
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Nav
                        navStyle="tabs"
                        activeKey={activeTab}
                        onSelect={(eventKey, event) => {
                            this.setState({ activeTab: eventKey });
                        }}
                        style={{ marginBottom: 10 }}
                    >
                        <NavItem eventKey="machine">{i18n._('Machine Settings')}</NavItem>
                        <NavItem eventKey="home">{i18n._('Define Home')}</NavItem>
                        <NavItem eventKey="edge">{i18n._('Edge Calibration')}</NavItem>
                        <NavItem eventKey="precision">{i18n._('Precision Calibration')}</NavItem>
                    </Nav>
                    <div className={styles.navContent} style={{ height: height }}>
                        {activeTab === 'machine' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={{ top: '20px' }}>
                                    <img
                                        className={styles.hero}
                                        alt="Calibration Motors"
                                        src="/images/calibration_dimensions.png"
                                    />
                                </div>
                                <div className={styles.top}>
                                    {'Please review your workspace settings and ensure the stock is centered between the motors.'}
                                    <br />
                                    {'For help, or to change units, see the lower-left corner of this dialog.'}
                                </div>
                                <div className={styles.bottom}>
                                    Width:
                                    <input
                                        type="text"
                                        name="machineWidth"
                                        className={styles.mmInput}
                                        value={machineWidth}
                                        onChange={e => {
                                            this.updateKinematics({ machineWidth: this.toMM(e.target.value) || 0 });
                                            this.setState({ machineWidth: e.target.value });
                                        }}
                                    />
                                    Height:
                                    <input
                                        type="text"
                                        name="machineHeight"
                                        className={styles.mmInput}
                                        value={machineHeight}
                                        onChange={e => {
                                            this.updateKinematics({ machineHeight: this.toMM(e.target.value) || 0 });
                                            this.setState({ machineHeight: e.target.value });
                                        }}
                                    />
                                    <br />
                                    {'When you are ready, make your way through each of the tabs, from left to right.'}
                                </div>
                            </div>
                        )}
                        {activeTab === 'home' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={{ top: '20px' }}>
                                    <img
                                        className={styles.hero}
                                        alt="Calibration Motors"
                                        src="/images/calibration_motor.png"
                                    />
                                </div>
                                <div className={styles.top}>
                                    {'Your "Home" position is at the center of the workspace, where Machine Position (MPos) = 0, 0, 0.'}
                                    <br />
                                    {'Make sure your sled is as close as possible to this point before proceeding.'}
                                </div>
                                <div className={styles.bottom}>
                                    {'Measure motorOffsetY coplanar with the workspace. For distBetweenMotors, measure between the centers of the sprockets.'}
                                    <br />
                                    {'Enter approximate measurements, within 5mm tolerance. Then, press "Define Home."'}
                                    <br />
                                    motorOffsetY:
                                    <input
                                        type="text"
                                        name="motorOffsetY"
                                        className={styles.mmInput}
                                        value={motorOffsetY}
                                        onChange={e => {
                                            this.updateKinematics({ motorOffsetY: this.toMM(e.target.value) || 0 });
                                            this.setState({ motorOffsetY: e.target.value });
                                        }}
                                    />
                                    distBetweenMotors:
                                    <input
                                        type="text"
                                        name="distBetweenMotors"
                                        className={styles.mmInput}
                                        value={distBetweenMotors}
                                        onChange={e => {
                                            this.updateKinematics({ distBetweenMotors: this.toMM(e.target.value) || 0 });
                                            this.setState({ distBetweenMotors: e.target.value });
                                        }}
                                    />
                                    Y Position (advanced):
                                    <input
                                        type="text"
                                        name="yHome"
                                        className={styles.mmInput}
                                        value={yHome}
                                        onChange={e => {
                                            this.setState({ ...this.state, yHome: e.target.value || 0 });
                                        }}
                                    />
                                    <Button
                                        btnSize="medium"
                                        btnStyle="flat"
                                        onClick={event => this.defineHome()}
                                    >
                                        <i className="fa fa-check" />
                                        {i18n._('Define Home')}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {isCalibrationTab && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={{ top: '50px' }}>
                                    {Object.keys(measurements).map((i) => {
                                        const v = measurements[i];
                                        const style = {
                                            ...{ position: 'absolute', width: '50px' },
                                            ...inputPositions[i]
                                        };
                                        return (<input
                                            type="text"
                                            style={style}
                                            name={'measurement' + i}
                                            key={'measurement' + i}
                                            value={v}
                                            onChange={e => {
                                                this.handleMeasurement(i, e.target.value);
                                            }}
                                        />);
                                    })}
                                    {buttonPositions.map((style, i) => {
                                        return (
                                            <Button
                                                btnSize="medium"
                                                btnStyle="flat"
                                                key={'position' + i}
                                                style={{ ...style, position: 'absolute', width: '50px' }}
                                                onClick={event => this.moveToPosition(i)}
                                            >
                                                {i18n._('Move')}
                                            </Button>
                                        );
                                    })}
                                    {result && (
                                        <div
                                            style={{ position: 'absolute', top: '80px', left: '80px' }}
                                        >
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td>Old</td>
                                                        <td>New</td>
                                                        <td>Delta</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Avg Err Distance (mm)</td>
                                                        <td>{result.orig.avgErrDist}</td>
                                                        <td>{result.optimized.avgErrDist}</td>
                                                        <td>{result.change.avgErrDist}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Err Distance (mm)</td>
                                                        <td>{result.orig.totalErrDist}</td>
                                                        <td>{result.optimized.totalErrDist}</td>
                                                        <td>{result.change.totalErrDist}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Max Err Distance (mm)</td>
                                                        <td>{result.orig.maxErrDist}</td>
                                                        <td>{result.optimized.maxErrDist}</td>
                                                        <td>{result.change.maxErrDist}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Chain Tolerance (Left) (%)</td>
                                                        <td>{result.orig.leftChainTolerance}</td>
                                                        <td>{result.optimized.leftChainTolerance}</td>
                                                        <td>{result.change.leftChainTolerance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Chain Tolerance (Right) (%)</td>
                                                        <td>{result.orig.rightChainTolerance}</td>
                                                        <td>{result.optimized.rightChainTolerance}</td>
                                                        <td>{result.change.rightChainTolerance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Dist Between Motors (mm):</td>
                                                        <td>{result.orig.distBetweenMotors}</td>
                                                        <td>{result.optimized.distBetweenMotors}</td>
                                                        <td>{result.change.distBetweenMotors}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Motor Offset Y (mm)</td>
                                                        <td>{result.orig.motorOffsetY}</td>
                                                        <td>{result.optimized.motorOffsetY}</td>
                                                        <td>{result.change.motorOffsetY}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <Button
                                                btnSize="lg"
                                                btnStyle="flat"
                                                onClick={event => this.applyResults()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply Calibration Results')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {isEdgeTab && (
                                    <div className={styles.top}>
                                        {'Press each "Move" button to move the sled to that position.'}
                                        <br />
                                        {'Enter the measurements from the edge of the sled to the edge of the stock.'}
                                    </div>
                                )}
                                {isPrecisionTab && (
                                    <div className={styles.top}>
                                        {'This step is optional; it works like Edge calibration, but is more accurate.'}
                                        <br />
                                        {'Each location will cut a hole; measure from the center of the hole to the edge of the stock.'}
                                    </div>
                                )}
                                <div className={styles.bottom}>
                                    {(!canCalibrate) && (!isCalibrating) && (
                                        <div>
                                            {'Once all measurements have been entered, the "Calibrate" button will appear.'}
                                        </div>
                                    )}
                                    <span>
                                        {'Target distance from edge: '}
                                        <input
                                            type="text"
                                            name="edgeDistance"
                                            className={styles.mmInput}
                                            value={edgeDistance}
                                            onChange={e => {
                                                this.updateCalibrationOpts({ edgeDistance: this.toMM(e.target.value) || 0 });
                                                this.setState({ edgeDistance: e.target.value });
                                            }}
                                        />
                                    </span>
                                    {isEdgeTab && (
                                        <span>
                                            {'Sled radius: '}
                                            <input
                                                type="text"
                                                name="sledRadius"
                                                className={styles.mmInput}
                                                value={sledRadius}
                                                onChange={e => {
                                                    this.updateCalibrationOpts({ sledRadius: this.toMM(e.target.value) || 0 });
                                                    this.setState({ sledRadius: e.target.value });
                                                }}
                                            />
                                        </span>
                                    )}
                                    {isPrecisionTab && (
                                        <span>
                                            {'Cut depth: '}
                                            <input
                                                type="text"
                                                name="cutDepth"
                                                className={styles.mmInput}
                                                value={cutDepth}
                                                onChange={e => {
                                                    this.updateCalibrationOpts({ cutDepth: this.toMM(e.target.value) || 0 });
                                                    this.setState({ cutDepth: e.target.value });
                                                }}
                                            />
                                        </span>
                                    )}
                                    {canCalibrate && (
                                        <Button
                                            btnSize="medium"
                                            btnStyle="flat"
                                            onClick={event => this.calibrate()}
                                        >
                                            <i className="fa fa-bullseye" />
                                            {i18n._('Calibrate')}
                                        </Button>
                                    )}
                                    {isCalibrating && (
                                        <div>
                                            Calibrating...
                                        </div>
                                    )}
                                    {applied && (
                                        <div>
                                            Please close and re-open the connection before calibrating again.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <span style={{ float: 'left' }}>
                        Units:
                        <select
                            className={styles.mmInput}
                            style={{ marginRight: '10px' }}
                            name="units"
                            value={units}
                            onChange={(event) => {
                                this.updateCalibrationOpts({
                                    measuredInches: event.target.value === 'in'
                                });
                                // Reload state from calibration/kinematics to account for unit change.
                                this.setState(this.internalState);
                            }}
                        >
                            <option value="mm">{i18n._('mm')}</option>
                            <option value="in">{i18n._('in')}</option>
                        </select>
                        <a href="http://bit.ly/maslow-calibration" target="_blank">Calibration Help</a>
                    </span>
                    <Button onClick={actions.closeModal}>
                        {i18n._('Close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CalibrationModal;
