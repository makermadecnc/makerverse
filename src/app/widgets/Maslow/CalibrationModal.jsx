import _ from 'lodash';
import PropTypes from 'prop-types';
import log from 'app/lib/log';
import React, { PureComponent } from 'react';
import { Button } from 'app/components/Buttons';
import Modal from 'app/components/Modal';
import { Nav, NavItem } from 'app/components/Navs';
import Space from 'app/components/Space';
import i18n from 'app/lib/i18n';
import Workspaces from 'app/lib/workspaces';
import analytics from 'app/lib/analytics';
import MaslowCalibration from 'app/lib/Maslow/MaslowCalibration';
import styles from './index.styl';

const defaultMeasurements = {
    0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''
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

    event(opts) {
        analytics.event({
            ...opts,
            category: 'interaction',
            action: 'calibration',
        });
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
            cutEdgeDistance: this.fromMM(this.calibration.opts.cutEdgeDistance, inches),
            machineWidth: this.fromMM(this.calibration.kin.opts.machineWidth, inches),
            machineHeight: this.fromMM(this.calibration.kin.opts.machineHeight, inches),
            origChainLength: this.fromMM(this.calibration.kin.opts.origChainLength, inches),
            motorOffsetY: this.fromMM(this.calibration.kin.opts.motorOffsetY, inches),
            distBetweenMotors: this.fromMM(this.calibration.kin.opts.distBetweenMotors, inches),
            sledRadius: this.fromMM(this.calibration.opts.sledRadius, inches),
            sledWeight: this.fromMM(this.calibration.kin.opts.sledWeight, inches),
            chainLength: this.fromMM(this.calibration.kin.opts.chainLength, inches),
        };
    }

    state = {
        ...this.internalState,
        measurements: defaultMeasurements,
        activeTab: 'machine',
        yHome: 0,
        definedHome: false,
        setMachineSettings: false,
        calibrating: -1,
        result: false,
        wiping: false,
        wiped: false,
    };

    controllerEvents = {
        'controller:settings': (type, controllerSettings) => {
            log.info(`Controller settings updated; reloading calibration ${controllerSettings}`);
            this.calibration.loadControllerSettings(controllerSettings);
            this.setState(this.internalState);
        }
    };

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
    }

    componentWillUnmount() {
        this.workspace.removeControllerEvents(this.controllerEvents);
    }

    handleMeasurement(idx, val) {
        this.setState({ measurements: { ...this.state.measurements, [idx]: val } });
    }

    updateCalibrationResults(percent) {
        this.setState({ calibrating: percent });
    }

    writeLines(lines, delay = 2500) {
        if (lines.length <= 0) {
            return;
        }
        this.workspace.controller.writeln(lines.shift());
        setTimeout(() => {
            this.writeLines(lines, delay);
        }, delay);
    }

    wipe() {
        this.event({ label: 'wipe' });
        this.workspace.controller.command('wipe');
        setTimeout(() => {
            this.workspace.controller.command('about');
        }, 5000);
        this.setState({ wiping: false, wiped: true });
    }

    calibrate() {
        this.event({ label: 'calculate' });
        this.workspace.hasOnboarded = true;
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
        }, 100);
    }

    applyCalibrationResults() {
        this.event({ label: 'apply' });
        const settings = this.calibration.kin.settings.map;
        const sks = Object.keys(settings);
        const result = this.state.result;
        this.unlock();
        Object.keys(result.optimized).forEach((k) => {
            if (!sks.includes(k)) {
                return;
            }
            const name = settings[k].name;
            const val = result.optimized[k];
            const cmd = `${name}=${val}`;
            this.workspace.controller.writeln(cmd);
        });
        this.setState({ ...this.state, result: null });
    }

    updateKinematics(opts) {
        this.calibration.kin.recomputeGeometry(opts);
        log.debug('kinematics', this.calibration.kin.opts);
    }

    updateCalibrationOpts(opts) {
        this.calibration.update(opts);
        log.debug('calibration', this.calibration.opts);
    }

    unlock() {
        this.workspace.controller.command('unlock');
    }

    reset() {
        this.workspace.controller.command('reset');
    }

    moveToCenter() {
        this.unlock();
        this.workspace.controller.writeln('G90');
        this.workspace.controller.writeln('G0 X0 Y0');
    }

    moveToPosition(index) {
        const gcode = this.calibration.generateGcodePoint(index);
        log.debug(`Moving to position ${index}`);
        this.unlock();
        gcode.forEach((cmd) => {
            this.workspace.controller.writeln(cmd);
        });
    }

    writeSetting(name, value) {
        const setting = this.calibration.kin.settings.map[name];
        this.workspace.controller.writeln(`${setting.name}=${value}`);
    }

    setMachineSettings() {
        this.event({ label: 'resize' });
        this.workspace.hasOnboarded = true;
        this.unlock();
        this.writeSetting('machineWidth', this.calibration.kin.opts.machineWidth);
        this.writeSetting('machineHeight', this.calibration.kin.opts.machineHeight);
        this.writeSetting('chainLength', this.calibration.kin.opts.chainLength);
        this.writeSetting('sledWeight', this.calibration.kin.opts.sledWeight);
        this.setState({
            ...this.state,
            setMachineSettings: true,
        });
    }

    defineHome(opts) {
        this.event({ label: 'home' });
        this.workspace.hasOnboarded = true;
        const chainLengths = this.calibration.kin.positionToChain(0, this.toMM(this.state.yHome));
        this.calibration.kin.opts.origChainLength = Math.round((chainLengths[0] + chainLengths[1]) / 2);
        this.unlock();
        this.writeSetting('origChainLength', this.calibration.kin.opts.origChainLength);
        this.writeSetting('motorOffsetY', this.calibration.kin.opts.motorOffsetY);
        this.writeSetting('distBetweenMotors', this.calibration.kin.opts.distBetweenMotors);
        this.workspace.controller.command('gcode', '$H');
        this.setState({
            ...this.state,
            origChainLength: this.calibration.kin.opts.origChainLength,
            definedHome: true,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const tab = this.state.activeTab;
        const isPrecisionTab = tab === 'precision';
        const isEdgeTab = tab === 'edge';
        if (prevState.activeTab !== tab && (isPrecisionTab || isEdgeTab)) {
            this.updateCalibrationOpts({
                cutHoles: isPrecisionTab,
            });
        }
    }

    getCalibrationRecommendation(result) {
        const isPrecisionTab = this.state.activeTab === 'precision';
        let pre = '';
        if (result.xError > 0) {
            pre += `When you Defined Home, it appears your X coordinate was off by about ${result.xError}mm from the center of the stock.`;
            pre += 'Consider closing this modal, ensuring the sled is centered, and starting from Define Home again. Otherwise... ';
        }
        if (result.change.avgErrDist > 0 || result.change.maxErrDist > 0) {
            return pre + 'The error margin went up. This should not happen. Please start over from the beginning.';
        } else if (result.optimized.maxErrDist <= 3 && result.optimized.avgErrDist <= 2) {
            return pre + 'Your machine is extremely well calibrated.';
        } else if (result.optimized.maxErrDist <= 8 && result.optimized.avgErrDist <= 4) {
            if (isPrecisionTab) {
                return pre + 'Results are generally good, but might improve using a tiny endmill to calibrate again.';
            } else {
                return pre + 'Results are good; precision calibration may improve them further';
            }
        } else if (result.optimized.totalErrDist <= 30 && result.optimized.avgErrDist <= 10) {
            return pre + 'Your machine could be calibrated further. Try starting the entire calibration process again.';
        } else {
            return pre + 'Your machine is still pretty un-calibrated. Try starting the calibration process again. If it does not improve, review the help.';
        }
    }

    render() {
        const { actions } = this.props;
        const edge = '0%';
        const inset = '10%';
        const btn = '10%';
        const midX = { left: '50%', transform: 'translate(-50%, 0%)' };
        const inputPositions = [
            { ...midX, top: edge },
            { top: edge, right: inset },
            { top: inset, right: edge },
            { bottom: inset, right: edge },
            { bottom: edge, right: inset },
            { ...midX, bottom: edge },
            { bottom: edge, left: inset },
            { bottom: inset, left: edge },
            { top: inset, left: edge },
            { top: edge, left: inset },
        ];
        const buttonPositions = [
            { ...midX, top: btn },
            { top: btn, right: btn },
            { bottom: btn, right: btn },
            { ...midX, bottom: btn },
            { bottom: btn, left: btn },
            { top: btn, left: btn },
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
            sledWeight,
            chainLength,
            calibrating,
            setMachineSettings,
            definedHome,
            result,
            sledRadius,
            yHome,
            wiping,
            wiped,
        } = this.state;
        const isCalibrating = calibrating >= 0;
        const hasCalibrationResult = !!result;
        const height = Math.max(window.innerHeight / 2, 200);
        const emptyInputIdx = _.findIndex(Object.keys(measurements), (m) => {
            return typeof measurements[m] === 'string' && measurements[m].length === 0;
        });
        const nanIdx = _.findIndex(Object.keys(measurements), (m) => {
            return Number.isNaN(measurements[m]);
        });
        const measurementsValid = emptyInputIdx < 0 && nanIdx < 0;
        const canCalibrate = measurementsValid && !isCalibrating && !hasCalibrationResult;
        const isPrecisionTab = activeTab === 'precision';
        const isEdgeTab = activeTab === 'edge';
        const isCalibrationTab = isPrecisionTab || isEdgeTab;
        const isImperial = !!measuredInches;
        const units = isImperial ? 'in' : 'mm';
        const edgeDistanceKey = isPrecisionTab ? 'cutEdgeDistance' : 'edgeDistance';
        const edgeDistance = this.state[edgeDistanceKey];
        const nonstandardSize = Math.abs(2438.4 - machineWidth) > 0.1 || Math.abs(1219.2 - machineHeight) > 0.1;

        return (
            <Modal
                disableOverlay
                size="lg"
                onClose={() => {
                    this.workspace.hasOnboarded = true;
                    actions.closeModal();
                }}
            >
                <Modal.Header>
                    <Modal.Title>
                        Maslow Calibration
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ float: 'right' }}>
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => {
                                this.unlock();
                            }}
                            title={i18n._('Clear system alarm')}
                        >
                            <i className="fa fa-unlock-alt" />
                            <Space width="8" />
                            {i18n._('Unlock')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                this.reset();
                            }}
                            title={i18n._('Reset board connection')}
                        >
                            <i className="fa fa-undo" />
                            <Space width="8" />
                            {i18n._('Reset')}
                        </button>
                    </div>
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
                                <div className={styles.center}>
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
                                    <div>
                                        These values on this tab should only be changed if you have a nonstandard setup.
                                    </div>
                                    <div>
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
                                    </div>
                                    <div>
                                        Full Length of Each Chain:
                                        <input
                                            type="text"
                                            name="chainLength"
                                            className={styles.mmInput}
                                            value={chainLength}
                                            onChange={e => {
                                                this.updateKinematics({ chainLength: this.toMM(e.target.value) || 0 });
                                                this.setState({ chainLength: e.target.value });
                                            }}
                                        />
                                        Sled Weight:
                                        <input
                                            type="text"
                                            name="sledWeight"
                                            className={styles.mmInput}
                                            value={sledWeight}
                                            onChange={e => {
                                                this.updateKinematics({ sledWeight: this.toMM(e.target.value) || 0 });
                                                this.setState({ sledWeight: e.target.value });
                                            }}
                                        />
                                        (Newtons)
                                    </div>
                                    {nonstandardSize && (
                                        <div>
                                            Note: you have entered a size different than a standard Maslow (4x8 feet).
                                        </div>
                                    )}
                                    {!setMachineSettings && (
                                        <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                                            <Button
                                                btnSize="medium"
                                                btnStyle="flat"
                                                onClick={event => this.setMachineSettings()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Next Step')}
                                            </Button>
                                        </div>
                                    )}
                                    {setMachineSettings && (
                                        <div>
                                            {'When you are ready, make your way through each of the tabs, from left to right.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'home' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center}>
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
                                    <br />
                                    {'You may need to close this dialog and jog/shuttle the sled into position.'}
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
                                    {definedHome && (
                                        <span>
                                            Homed!
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        {isCalibrationTab && (
                            <div className={styles.tabFull}>
                                {!hasCalibrationResult && (
                                    <div className={styles.center}>
                                        {Object.keys(measurements).map((i) => {
                                            const v = measurements[i];
                                            const style = {
                                                ...{ position: 'absolute', width: '50px' },
                                                ...inputPositions[i]
                                            };
                                            return (
                                                <input
                                                    type="text"
                                                    style={style}
                                                    name={'measurement' + i}
                                                    key={'measurement' + i}
                                                    value={v}
                                                    onChange={e => {
                                                        this.handleMeasurement(i, e.target.value);
                                                    }}
                                                />
                                            );
                                        })}
                                        {!isCalibrating && buttonPositions.map((style, i) => {
                                            const key = `position${i}`;
                                            return (
                                                <Button
                                                    btnSize="medium"
                                                    btnStyle="flat"
                                                    key={key}
                                                    style={{ ...style, position: 'absolute', width: '50px' }}
                                                    onClick={event => this.moveToPosition(i)}
                                                >
                                                    {i18n._(isPrecisionTab ? 'Cut' : 'Move')}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                                {hasCalibrationResult && (
                                    <div className={styles.center}>
                                        <table
                                            style={{ position: 'absolute', left: '0px', bottom: '0px' }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <td />
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
                                        <div
                                            style={{ position: 'absolute', right: '0px', bottom: '0px', width: '40%' }}
                                        >
                                            {this.getCalibrationRecommendation(result)}
                                            <br />
                                            <Button
                                                btnSize="lg"
                                                btnStyle="flat"
                                                onClick={event => this.applyCalibrationResults()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply Calibration Results')}
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                                    <span>
                                        {'Target distance from edge: '}
                                        <input
                                            type="text"
                                            name={edgeDistanceKey}
                                            key={edgeDistanceKey}
                                            className={styles.mmInput}
                                            value={edgeDistance}
                                            onChange={e => {
                                                this.updateCalibrationOpts({ [edgeDistanceKey]: this.toMM(e.target.value) || 0 });
                                                this.setState({ [edgeDistanceKey]: e.target.value });
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
                                </div>
                                <div className={styles.middle}>
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
                                    {isCalibrating && (i18n._('Calibrating') + '...')}
                                    {!canCalibrate && !isCalibrating && !hasCalibrationResult && (
                                        <span style={{ fontStyle: 'italic' }}>
                                            {'Once all measurements have been entered, the "Calibrate" button will appear.'}
                                            <br /><br />
                                            {'Tip: try to keep the Console visible in the background of this modal. '}
                                            {'Watch the console output; it can help to learn the gcode & grbl commands, as well as spot problems.'}
                                        </span>
                                    )}
                                    <br />
                                    <Button
                                        btnSize="medium"
                                        btnStyle="flat"
                                        onClick={event => this.moveToCenter()}
                                    >
                                        <i className="fa fa-bullseye" />
                                        {i18n._('Move to Center')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {wiping && (
                        <span style={{ float: 'left' }}>
                            <Button
                                style={{ marginRight: '10px' }}
                                onClick={() => this.setState({ wiping: false })}
                            >
                                {i18n._('Cancel')}
                            </Button>
                            <strong>
                                {i18n._('Are you sure?')}
                                {' '}
                            </strong>
                            {i18n._('This will reset all machine & calibration settings (eeprom).')}
                            <Button
                                style={{ marginLeft: '10px' }}
                                onClick={() => this.wipe()}
                            >
                                {i18n._('Accept')}
                            </Button>
                        </span>
                    )}
                    {!wiping && (
                        <span style={{ float: 'left' }}>
                            {wiped && (
                                <span style={{ float: 'left' }}>
                                    Settings have been wiped.
                                </span>
                            )}
                            {!wiped && (
                                <Button
                                    style={{ marginRight: '40px' }}
                                    onClick={() => this.setState({ wiping: true })}
                                >
                                    {i18n._('Wipe Settings')}
                                </Button>
                            )}
                            Units:{' '}
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
                            <a href="http://bit.ly/maslow-calibration" target="_blank" rel="noopener noreferrer">
                                Calibration Help
                            </a>
                        </span>
                    )}
                    <Button onClick={actions.closeModal}>
                        {i18n._('Close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CalibrationModal;
