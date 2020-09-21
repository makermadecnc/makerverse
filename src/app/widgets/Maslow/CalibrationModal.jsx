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
import MaslowCalibration, { sleds, sled } from 'app/lib/Maslow/MaslowCalibration';
import styles from './index.styl';
import MeasureChainsFlow from './MeasureChainsFlow';
import {
    MODAL_CALIBRATION
} from './constants';

const defaultMeasurements = {
    0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: ''
};

class CalibrationModal extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        activeTab: PropTypes.string,
        calibrated: PropTypes.bool,
        state: PropTypes.object,
        actions: PropTypes.object
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    event(opts) {
        analytics.event({
            ...{ category: 'interaction', action: 'press', label: 'quickaccess' },
            ...opts,
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
        const sledDimensions = this.calibration.sledDimensions;

        return {
            cutDepth: this.fromMM(this.calibration.opts.cutDepth, inches), // mm to cut in the calibration pattern (zero = no cutting)
            cutHoles: this.calibration.opts.cutHoles,
            sledType: sled.type,
            measuredInches: inches,
            edgeDistance: this.fromMM(this.calibration.opts.edgeDistance, inches),
            cutEdgeDistance: this.fromMM(this.calibration.opts.cutEdgeDistance, inches),
            machineWidth: this.fromMM(this.calibration.kin.opts.machineWidth, inches),
            machineHeight: this.fromMM(this.calibration.kin.opts.machineHeight, inches),
            origChainLength: this.fromMM(this.calibration.kin.opts.origChainLength, inches),
            motorOffsetY: this.fromMM(this.calibration.kin.opts.motorOffsetY, inches),
            distBetweenMotors: this.fromMM(this.calibration.kin.opts.distBetweenMotors, inches),
            sledWeight: this.calibration.kin.opts.sledWeight,
            chainLength: this.fromMM(this.calibration.kin.opts.chainLength, inches),
            rotationDiskRadius: this.fromMM(this.calibration.kin.opts.rotationDiskRadius, inches),
            chainOverSprocket: this.calibration.kin.opts.chainOverSprocket,
            sledDimensions: {
                top: this.fromMM(sledDimensions.top, inches),
                right: this.fromMM(sledDimensions.right, inches),
                bottom: this.fromMM(sledDimensions.bottom, inches),
                left: this.fromMM(sledDimensions.left, inches),
            },
            zAxisRes: this.workspace.machineSettings.getValue('zAxisRes'),
            zInvert: this.workspace.machineSettings.isAxisInverted('z') ? '1' : '0',
            zDistPerRot: this.workspace.machineSettings.getValue('zAxisDistancePerRotation'),
            zMove: inches ? 0.25 : 10,
            exported: JSON.stringify(this.calibration.kin.export(), null, 4),
            kinematicsType: this.workspace.machineSettings.getValue('kinematicsType', 2),
        };
    }

    state = {
        ...this.internalState,
        measurements: defaultMeasurements,
        activeTab: this.props.activeTab || 'machine',
        setMachineSettings: false,
        setWorkspaceSettings: false,
        setFrameSettings: false,
        setChains: false,
        measuredChains: null,
        calibrating: -1,
        calibrated: !!this.props.calibrated,
        result: false,
        wiping: false,
        wiped: false,
        chainError: null,
        zMoved: 0,
        chainsStep: null,
    };

    controllerEvents = {
        'controller:settings': (type, controllerSettings) => {
            log.info('Controller settings updated; reloading calibration', controllerSettings);
            this.calibration.loadControllerSettings(controllerSettings);
            this.setState(this.internalState);
        }
    };

    setChainsStep(step) {
        this.setState({ chainsStep: step });
    }

    updateActiveTab() {
        const tab = this.state.activeTab;
        const isPrecisionTab = tab === 'precision';
        const isEdgeTab = tab === 'edge';
        if (isPrecisionTab || isEdgeTab) {
            this.updateCalibrationOpts({ cutHoles: isPrecisionTab });
        }
    }

    componentDidMount() {
        this.workspace.addControllerEvents(this.controllerEvents);
        this.updateActiveTab();
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

    wipe() {
        this.event({ label: 'wipe' });
        this.workspace.controller.command('wipe');
        setTimeout(() => {
            window.location.reload();
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

    nextCalibration() {
        this.workspace.reOpenPort(() => {
            this.props.actions.openModal(MODAL_CALIBRATION, {
                activeTab: this.state.activeTab,
                calibrated: true,
            });
        });
    }

    writeCalibrationResult(result, callback) {
        const settings = this.calibration.kin.settings.map;
        const sks = Object.keys(settings);
        const grblSettings = {};
        Object.keys(result.optimized).forEach((k) => {
            if (!sks.includes(k)) {
                return;
            }
            grblSettings[settings[k].name] = result.optimized[k];
        });
        this.workspace.machineSettings.write(grblSettings, () => {
            if (callback) {
                callback();
            }
        });
    }

    applyCalibrationResults() {
        this.event({ label: 'apply' });
        this.writeCalibrationResult(this.state.result, () => this.nextCalibration());
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
        const gcode = this.calibration.generateGoToCenterGcode();
        this.unlock();
        gcode.forEach((cmd) => {
            this.workspace.controller.writeln(cmd);
        });
    }

    measureCenterOffset(xOff, yOff) {
        this.event({ label: 'center' });
        const pt = { x: this.toMM(xOff), y: this.toMM(yOff) };
        const hp = { x: 0, y: this.state.yHome };
        const res = this.calibration.calibrateOrigin(hp, pt);
        log.debug('Center offset calibration', res);
        this.writeCalibrationResult(res);
        this.setState({ ...this.state, measuredChains: res });
    }

    moveToPosition(index) {
        const gcode = this.calibration.generateCalibrationGcode(index);
        log.debug(`Moving to position ${index}`);
        this.unlock();
        gcode.forEach((cmd) => {
            this.workspace.controller.writeln(cmd);
        });
    }

    zApplyScaling() {
        const scale = Math.abs(Number(this.state.zMove)) / Math.abs(Number(this.state.zMoved));
        const zAxisRes = Number(this.state.zAxisRes) * scale;
        this.workspace.machineSettings.write({ zAxisRes: zAxisRes });
        this.setState({ zAxisRes: zAxisRes });
    }

    zMove(val) {
        this.unlock();
        this.workspace.controller.writeln('G91');
        this.workspace.controller.writeln('G21');
        this.workspace.controller.writeln(`G0 Z${this.toMM(val)}`);
        this.workspace.controller.writeln('G90');
    }

    setMachineSettings() {
        this.event({ label: 'resize' });
        this.workspace.hasOnboarded = true;
        this.workspace.machineSettings.write({
            chainOverSprocket: this.calibration.kin.opts.chainOverSprocket,
            chainLength: this.calibration.kin.opts.chainLength,
            sledWeight: this.calibration.kin.opts.sledWeight,
        });
        this.setState({ ...this.state, setMachineSettings: true });
    }

    setWorkspaceSettings() {
        this.event({ label: 'resize' });
        this.workspace.hasOnboarded = true;
        this.workspace.machineSettings.write({
            machineWidth: this.calibration.kin.opts.machineWidth,
            machineHeight: this.calibration.kin.opts.machineHeight,
        });
        this.setState({ ...this.state, setWorkspaceSettings: true });
    }

    resetCalibration() {
        this.event({ label: 'reset' });
        this.workspace.hasOnboarded = true;
        this.workspace.machineSettings.write({
            leftChainTolerance: 0,
            rightChainTolerance: 0,
        });
        this.setState({ ...this.state, resetCalibration: true, chainError: null });
    }

    setChains(yMeasure) {
        this.event({ label: 'chains' });
        this.workspace.hasOnboarded = true;

        const yFromTop = this.toMM(yMeasure) + this.calibration.sledDimensions.top;
        const yPos = this.calibration.kin.opts.machineHeight / 2 - yFromTop;
        const chainLengths = this.calibration.kin.positionToChain(0, yPos);
        const chainDiff = Math.abs(chainLengths[0] - chainLengths[1]);
        const { leftChainTolerance, rightChainTolerance } = this.calibration.kin.opts;
        const previouslyCalibrated = leftChainTolerance !== 0 || rightChainTolerance !== 0;
        if (previouslyCalibrated && chainDiff >= 1) {
            this.setState({ ...this.state, chainError: chainLengths[1] - chainLengths[0] });
            return;
        }
        const origChainLength = Math.round((chainLengths[0] + chainLengths[1]) / 2);
        this.updateKinematics({ origChainLength: origChainLength });
        this.workspace.machineSettings.write({
            origChainLength: this.calibration.kin.opts.origChainLength,
        }, () => {
            this.workspace.controller.command('homing');
        });
        this.setState({ ...this.state, setChains: true, yHome: yPos }); //, chainError: null });
    }

    setCustomSledDimension(edge, value) {
        sleds.Custom[edge] = this.toMM(Number(value));
        this.setState({ sledDimensions: { ...this.state.sledDimensions, [edge]: value } });
    }

    setFrameSettings() {
        this.event({ label: 'frame' });
        this.workspace.hasOnboarded = true;

        this.workspace.machineSettings.write({
            motorOffsetY: this.calibration.kin.opts.motorOffsetY,
            distBetweenMotors: this.calibration.kin.opts.distBetweenMotors,
        });
        this.setState({ ...this.state, setFrameSettings: true }); //, chainError: null });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.activeTab !== this.state.activeTab) {
            this.updateActiveTab();
        }
    }

    getCalibrationRecommendation(result, accuracy) {
        const isPrecisionTab = this.state.activeTab === 'precision';
        let pre = '';
        const xErrAmt = Math.abs(result.xError);
        if (xErrAmt > 0) {
            const dir = result.xError > 0 ? 'left' : 'right';
            pre += `It appears your stock was loaded about ${xErrAmt}mm to the ${dir} from the center of workspace. `;
        }
        const skewAmt = Math.abs(result.skew);
        if (skewAmt > 0) {
            const dir = result.skew > 0 ? 'clockwise' : 'counter-clockwise';
            pre += `Measurements indicate about ${skewAmt}mm ${dir} skew. `;
            pre += 'Be extra-certain the stock is not rotated. Otherwise, this should disappear with repeated calibration. ';
        }
        if (result.change.avgErrDist > 0 || result.change.maxErrDist > 0) {
            return pre + 'The error margin went up. This should not happen. Please start over from the beginning.';
        } else if (accuracy <= 3) {
            return pre + 'Your machine is extremely well calibrated.';
        } else if (accuracy <= 6.25) {
            if (isPrecisionTab) {
                return pre + 'Results are generally good, but might improve using a tiny endmill to calibrate again.';
            } else {
                return pre + 'Results are quite good for edge calibration; precision calibration may improve them further.';
            }
        } else if (accuracy <= 12.5 && !isPrecisionTab) {
            return pre + 'Results are decent for edge calibration. You should strive for less than 6mm accuracy (lower is better). You can apply results and use Edge calibration again, or move on to the "Precision" tab if results do not improve with repeated calibration.';
        } else if (accuracy <= 25) {
            return pre + 'For better accuracy, it is recommended that you run calibration again. You should strive for less than 6mm accuracy (lower is better). If this does not improve with repeated calibration, review the help.';
        } else {
            return pre + 'Your machine is quite un-calibrated. Please review the help, and check that your frame build is not compromising accuracy.';
        }
    }

    getBkImageStyle(img) {
        return {
            backgroundImage: `url(images/${img})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center center',
        };
    }

    renderAlreadyCalibrated() {
        return (
            <div className={styles.bottom}>
                <div>
                    {'Your machine appears to have been previously calibrated.'}
                    <br />
                    {'To change the frame, you must first clear the effects of edge/precision calibration.'}
                </div>
                <Button
                    btnSize="medium"
                    btnStyle="flat"
                    onClick={event => this.resetCalibration()}
                >
                    <i className="fa fa-warning" />
                    Reset Chain Tolerances
                </Button>
            </div>
        );
    }

    import(exportStr) {
        exportStr = exportStr.replaceAll('“', '"').replaceAll('”', '"');
        try {
            this.workspace.machineSettings.write(JSON.parse(exportStr));
            this.setState({ imported: true, importFailure: null });
        } catch (e) {
            this.setState({ imported: false, importFailure: e.message });
        }
    }

    setInvertZ(optionValue) {
        const invertZ = optionValue === '1';
        this.workspace.machineSettings.setAxisInverted('z', invertZ);
        this.setState({ zInvert: optionValue });
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
            setWorkspaceSettings,
            setFrameSettings,
            // setChains,
            measuredChains,
            result,
            wiping,
            wiped,
            rotationDiskRadius,
            chainOverSprocket,
            sledType,
            calibrated,
            chainError,
            sledDimensions,
            zInvert,
            zMove,
            zMoved,
            zAxisRes,
            exported,
            kinematicsType,
            imported,
            importFailure,
            zDistPerRot,
        } = this.state;
        const kt = Number(kinematicsType);
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
        const curTab = kt === 2 ? activeTab : 'triangular';
        const isPrecisionTab = curTab === 'precision';
        const isEdgeTab = curTab === 'edge';
        const isCalibrationTab = isPrecisionTab || isEdgeTab;
        const isImperial = !!measuredInches;
        const units = isImperial ? 'in' : 'mm';
        const edgeDistanceKey = isPrecisionTab ? 'cutEdgeDistance' : 'edgeDistance';
        const edgeDistance = this.state[edgeDistanceKey];
        const nonstandardSize = Math.abs(2438.4 - machineWidth) > 0.1 || Math.abs(1219.2 - machineHeight) > 0.1;
        const chainOffBottom = chainOverSprocket === 2 ? '2' : '1';
        const { leftChainTolerance, rightChainTolerance } = this.calibration.kin.opts;
        const offCenter = Math.abs(leftChainTolerance - rightChainTolerance) >= 0.001;
        const alreadyStartedCalibration = offCenter;
        const canApplyCalibration = this.workspace.isReady;
        const edges = ['top', 'right', 'bottom', 'left'];
        const accuracy = result ? Math.max(1, Math.round(result.optimized.maxErrDist * 10) / 10) : 0;

        const stepDirectionInvert = this.workspace.machineSettings.map.stepDirectionInvert;
        const zAxisDistancePerRotation = this.workspace.machineSettings.map.zAxisDistancePerRotation;

        const zAxisResSetting = this.workspace.machineSettings.map.zAxisRes;
        const canShowTabs = curTab !== 'triangular';

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
                        {'Maslow Calibration   '}
                        {canShowTabs && (
                            <button
                                type="button"
                                className="btn btn-small"
                                onClick={() => {
                                    this.setState({ activeTab: 'export' });
                                }}
                                title="Export and import calibration settings"
                            >
                                {i18n._('Export Calibration')}
                            </button>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {canShowTabs && (
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
                    )}
                    {canShowTabs && (
                        <Nav
                            navStyle="tabs"
                            activeKey={curTab}
                            onSelect={(eventKey, event) => {
                                this.setState({ activeTab: eventKey });
                            }}
                            style={{ marginBottom: 10 }}
                        >
                            <NavItem eventKey="machine">{i18n._('Machine')}</NavItem>
                            <NavItem eventKey="stock">{i18n._('Stock')}</NavItem>
                            <NavItem eventKey="frame">{i18n._('Frame')}</NavItem>
                            <NavItem eventKey="sled">{i18n._('Sled')}</NavItem>
                            <NavItem eventKey="z">{i18n._('Z-Axis')}</NavItem>
                            <NavItem eventKey="chains">{i18n._('Chains')}</NavItem>
                            <NavItem eventKey="edge">{i18n._('Edge')}</NavItem>
                            <NavItem eventKey="precision">{i18n._('Precision')}</NavItem>
                        </Nav>
                    )}
                    <div className={styles.navContent} style={{ height: height }}>
                        {curTab === 'triangular' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={ this.getBkImageStyle('calibration_overview.png') } />
                                <div className={styles.top}>
                                    {'Your Maslow is not using "triangular" kinematics.'}
                                    <br />
                                    {'Make sure your Maslow chains look like the picture (creating a triangle).'}
                                </div>
                                <div className={styles.bottom}>
                                    {'This message may be normal after wiping your settings.'}
                                    <br />
                                    {'If you are certain your machine matches, press the button to the right.'}
                                </div>
                                <div className={styles.nextStep}>
                                    <Button
                                        btnSize="medium"
                                        btnStyle="primary"
                                        onClick={event => this.workspace.machineSettings.write({
                                            kinematicsType: 2,
                                        })}
                                    >
                                        <i className="fa fa-check" />
                                        Use Triangular Kinematics
                                    </Button>
                                </div>
                            </div>
                        )}
                        {curTab === 'export' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center}>
                                    <textarea
                                        name="export"
                                        cols="30"
                                        rows="10"
                                        style={{ width: '100%', height: '100%' }}
                                        value={exported}
                                        onChange={(e) => {
                                            this.setState({ exported: e.target.value });
                                        }}
                                    />
                                </div>
                                <div className={styles.top}>
                                    {'Save the following text into a file.'}
                                    <br />
                                    {'To import, replace these contents and press the "Import" button in the bottom-right.'}
                                </div>
                                {importFailure && (
                                    <div className={styles.bottom}>
                                        {'There was an error during the import process:'}
                                        <br />
                                        {importFailure}
                                    </div>
                                )}
                                {imported && (
                                    <div className={styles.bottom}>
                                        Settings imported!
                                    </div>
                                )}
                                <div className={styles.nextStep}>
                                    <Button
                                        btnSize="medium"
                                        btnStyle="flat"
                                        onClick={event => this.import(exported)}
                                    >
                                        <i className="fa fa-check" />
                                        {i18n._('Import')}
                                    </Button>
                                </div>
                            </div>
                        )}
                        {curTab === 'machine' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={ this.getBkImageStyle('calibration_overview.png') }>
                                    <div style={{ position: 'absolute', bottom: '0px', right: '30%' }}>
                                        (Newtons)
                                    </div>
                                    <div style={{ position: 'absolute', bottom: '20%', right: '5%' }}>
                                    </div>
                                </div>
                                <div className={styles.top}>
                                    {'Your Maslow must be calibrated to account for the variables below.'}
                                    <br />
                                    {'Please validate the four settings (inputs) on this tab, then press "Next Step."'}
                                    <br />
                                    {'For help, or to change units, see the lower-left corner of this dialog.'}
                                </div>
                                <div className={styles.bottom}>
                                    {!setMachineSettings && (
                                        <div>
                                            These values on this tab should only be changed if you have a nonstandard setup.
                                        </div>
                                    )}
                                    {!setMachineSettings && (
                                        <div style={{ marginBottom: '10px' }}>
                                            <strong>Chain</strong>:
                                            <select
                                                value={chainOffBottom}
                                                className={styles.selectInput}
                                                onChange={e => {
                                                    this.updateKinematics({ chainOverSprocket: e.target.value });
                                                    this.setState({ chainOverSprocket: e.target.value });
                                                }}
                                            >
                                                <option value="1">Off Top</option>
                                                <option value="2">Off Bottom</option>
                                            </select>
                                            Full Length:
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
                                            <br />
                                            {'Sled Weight: '}
                                            <input
                                                type="text"
                                                name="sledWeight"
                                                className={styles.mmInput}
                                                value={sledWeight}
                                                onChange={e => {
                                                    this.updateKinematics({ sledWeight: e.target.value || 0 });
                                                    this.setState({ sledWeight: e.target.value });
                                                }}
                                            />
                                            (Newtons)
                                            {' Rotation Disk Radius: '}
                                            <input
                                                type="text"
                                                name="rotationDiskRadius"
                                                className={styles.mmInput}
                                                value={rotationDiskRadius}
                                                onChange={e => {
                                                    this.updateKinematics({ rotationDiskRadius: this.toMM(e.target.value) || 0 });
                                                    this.setState({ rotationDiskRadius: e.target.value });
                                                }}
                                            />
                                        </div>
                                    )}
                                    {!setMachineSettings && (
                                        <div className={styles.nextStep}>
                                            <Button
                                                btnSize="medium"
                                                btnStyle="primary"
                                                onClick={event => this.setMachineSettings()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply')}
                                            </Button>
                                        </div>
                                    )}
                                    {setMachineSettings && (
                                        <div className={styles.nextStep}>
                                            {'When you are ready, make your way through each of the tabs, from left to right.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {curTab === 'stock' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={ this.getBkImageStyle('calibration_dimensions.png') } />
                                <div className={styles.top}>
                                    {'Please be certain of the size of your stock before pressing "Next Step."'}
                                    <br />
                                    {'Most Maslows use 8\'x4\' plywood. Later calibration steps will rely on this measurement being accurate.'}
                                </div>
                                <div className={styles.bottom}>
                                    <div>
                                        {'Note: if your sled is not yet attached, it will be done later in Calibration.'}
                                    </div>
                                    <div>
                                        Stock Width:
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
                                        Stock Height:
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
                                    {nonstandardSize && (
                                        <div>
                                            Note: you have entered a size different than a standard Maslow (4x8 feet).
                                        </div>
                                    )}
                                    {!setWorkspaceSettings && (
                                        <div className={styles.nextStep}>
                                            <Button
                                                btnSize="medium"
                                                btnStyle="primary"
                                                onClick={event => this.setWorkspaceSettings()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply')}
                                            </Button>
                                        </div>
                                    )}
                                    {setWorkspaceSettings && (
                                        <div className={styles.nextStep}>
                                            {'Now proceed to the "Frame" tab.'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {curTab === 'frame' && (
                            <div className={styles.tabFull}>
                                <div className={styles.center} style={ this.getBkImageStyle('calibration_motor.png') } />
                                <div className={styles.top}>
                                    {chainError && (
                                        <div>
                                            {'Setting chains failed!'}
                                            <br />
                                            {'Your machine has already begun calibration, and the new chain position differs from the old.'}
                                        </div>
                                    )}
                                    {!chainError && (
                                        <div>
                                            {'Enter approximate measurements, within 6mm (1/4") tolerance. Then, press "Set Frame".'}
                                        </div>
                                    )}
                                </div>
                                {alreadyStartedCalibration && this.renderAlreadyCalibrated()}
                                {!alreadyStartedCalibration && (
                                    <div className={styles.bottom}>
                                        <div>
                                            {'Use the center of the sprocket (motor axis) for both motor measurements.'}
                                            <br />
                                            {'Measure motor height coplanar with the stock.'}
                                        </div>
                                        Motor Height:
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
                                        Motor Width:
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
                                        {!setFrameSettings && (
                                            <Button
                                                btnSize="medium"
                                                btnStyle="primary"
                                                className={styles.nextStep}
                                                onClick={event => this.setFrameSettings()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply')}
                                            </Button>
                                        )}
                                        {setFrameSettings && (
                                            <span className={styles.nextStep}>
                                                Now, move on to Chains.
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        {curTab === 'sled' && (
                            <div>
                                <div className={styles.top}>
                                    {'Occasionally during calibration, you will be asked to measure from the edge of your sled.'}
                                    <br />
                                    {'But first, please enter your sled dimensions (or select from a preset).'}
                                    <br />
                                    {'This allows calibration to determine the end-mill location based upon the edge of the sled.'}
                                </div>
                                <div className={styles.center}>
                                    <div style={{ paddingTop: '20px' }} >
                                        <span>
                                            Sled Type:
                                            <select
                                                value={sledType}
                                                className={styles.selectInput}
                                                onChange={e => {
                                                    MaslowCalibration.setSledType(e.target.value);
                                                    this.updateCalibrationOpts({ sledType: e.target.value });
                                                    // Reload state from calibration/kinematics to account many new values.
                                                    this.setState({
                                                        ...this.internalState,
                                                        sledType: e.target.value,
                                                    });
                                                }}
                                            >
                                                {Object.keys(sleds).map((k) => {
                                                    return (
                                                        <option
                                                            value={k}
                                                            key={k}
                                                        >
                                                            {k}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </span>
                                        {edges.map((edge) => {
                                            return (
                                                <div key={edge}>
                                                    {`Distance to ${edge} edge: `}
                                                    <input
                                                        type="text"
                                                        name={edge}
                                                        value={sledDimensions[edge]}
                                                        onChange={e => {
                                                            this.setCustomSledDimension(edge, e.target.value);
                                                        }}
                                                        disabled={sledType !== 'Custom'}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                        {curTab === 'z' && (
                            <div className={styles.tabFull}>
                                <div className={styles.top}>
                                    {'This step checks that your Z-axis is moving up and down correctly.'}
                                    <br />
                                    {'It may be skipped if you have already tested the Z-axis, or your machine came preconfigured for Z-movement.'}
                                </div>
                                <div className={styles.center} >
                                    {zAxisResSetting && (
                                        <div>
                                            <h3>Test Z-Axis</h3>
                                            Move the Z-axis up and down:
                                            <br />

                                            <input
                                                type="text"
                                                className={styles.mmInput}
                                                name="zMove"
                                                value={zMove}
                                                onChange={e => {
                                                    this.setState({ zMove: e.target.value });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-medium"
                                                onClick={() => this.zMove(Number(zMove))}
                                            >
                                                Move Up
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-medium"
                                                onClick={() => this.zMove(-Number(zMove))}
                                            >
                                                Move Down
                                            </button>
                                            <br /><br /><br />
                                            Use calipers or a mm tape measure to enter the actual movement:
                                            <br />
                                            Z-Distance Moved:
                                            <input
                                                type="text"
                                                className={styles.mmInput}
                                                name="zDist"
                                                value={zMoved}
                                                onChange={e => {
                                                    this.setState({ zMoved: e.target.value });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-medium btn-primary"
                                                onClick={() => this.zApplyScaling()}
                                            >
                                                Apply Scaling
                                            </button>
                                            <br /><br />
                                            If simple scaling does not work, you may need to adjust the following:
                                        </div>
                                    )}
                                    {!zAxisResSetting && (
                                        <div>
                                            Your machine cannot change the Z-axis speed.
                                        </div>
                                    )}
                                    <h3>Raw Settings</h3>
                                    <br />
                                    {zAxisResSetting && (
                                        <div>
                                            Z-Axis Resolution:
                                            <input
                                                type="text"
                                                name="zRes"
                                                value={zAxisRes}
                                                onChange={e => {
                                                    this.setState({ zAxisRes: e.target.value });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-medium"
                                                onClick={() => {
                                                    this.workspace.machineSettings.write({
                                                        zAxisRes: Number(zAxisRes),
                                                    });
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}
                                    {stepDirectionInvert && (
                                        <div>
                                            {'Invert Z-axis motion? '}
                                            <select
                                                className={styles.mmInput}
                                                style={{ marginRight: '10px' }}
                                                name="zInvert"
                                                value={zInvert}
                                                onChange={(event) => {
                                                    this.setInvertZ(event.target.value);
                                                }}
                                            >
                                                <option value="1">{i18n._('yes')}</option>
                                                <option default value="0">{i18n._('no')}</option>
                                            </select>
                                        </div>
                                    )}
                                    {zAxisDistancePerRotation && (
                                        <div>
                                            <br />
                                            <div>
                                                Your Maslow uses this additional value.<br />
                                                It may be negative in order to invert the Z-axis.
                                            </div>
                                            {'Z Distance per Rotation: '}
                                            <input
                                                type="text"
                                                name="zRes"
                                                value={zDistPerRot}
                                                onChange={e => {
                                                    this.setState({ zDistPerRot: e.target.value });
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-medium"
                                                onClick={() => {
                                                    this.workspace.machineSettings.write({
                                                        zAxisDistancePerRotation: Number(zDistPerRot),
                                                    });
                                                }}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    )}
                                    {!stepDirectionInvert && !zAxisDistancePerRotation && (
                                        <div>
                                            Your machine does not support Z-axis inversion.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {curTab === 'chains' && (
                            <div className={styles.tabFull}>
                                <div className={styles.top}>
                                    {'Now the Maslow will learn how long the chains are currently extended.'}
                                    <br />
                                    {'This will also create a "save point" to restore calibration (if chains ever come off sprockets).'}
                                    <br />
                                    {'Please read carefully; "Chains" are the most important step in all of calibration.'}
                                </div>
                                {!alreadyStartedCalibration && !measuredChains && (
                                    <div className={styles.center} >
                                        <MeasureChainsFlow
                                            calibration={this.calibration}
                                            step={this.state.chainsStep}
                                            setStep={this.setChainsStep.bind(this)}
                                            units={units}
                                            setChains={this.setChains.bind(this)}
                                            moveToCenter={this.moveToCenter.bind(this)}
                                            measureCenterOffset={this.measureCenterOffset.bind(this)}
                                            workspaceId={this.workspace.id}
                                        />
                                    </div>
                                )}
                                {!alreadyStartedCalibration && measuredChains && (
                                    <div className={styles.center} >
                                        <h4>Chains Set</h4>
                                        <span>
                                            Accuracy is currently at {Math.max(1, Math.round(measuredChains.optimized.maxErrDist * 10) / 10)}mm
                                            <br />
                                            <br />
                                            Use Edge Calibration (and then precision calibration) to finish calibration.
                                        </span>
                                    </div>
                                )}
                                {alreadyStartedCalibration && this.renderAlreadyCalibrated()}
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
                                            <h4>New Accuracy: {accuracy}mm</h4>
                                            <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
                                            {this.getCalibrationRecommendation(result, accuracy)}
                                            <hr style={{ marginTop: '10px', marginBottom: '10px' }} />
                                            These results must be applied to take effect! After they are applied, you may run Edge or Precision calibration again.
                                            <br /><br />
                                            {canApplyCalibration && (
                                                <Button
                                                    btnSize="lg"
                                                    btnStyle="primary"
                                                    onClick={event => this.applyCalibrationResults()}
                                                >
                                                    <i className="fa fa-check" />
                                                    {i18n._('Apply Calibration Results')}
                                                </Button>
                                            )}
                                            {!canApplyCalibration && (
                                                <span style={{ fontWeight: 'bold' }}>
                                                    The machine needs to be idle and unlocked to apply calibration results.
                                                </span>
                                            )}
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
                                        <div>
                                            If the edge of the sled goes outside the stock, use a negative value.
                                        </div>
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
                                        <div>
                                            <Button
                                                btnSize="medium"
                                                btnStyle="primary"
                                                onClick={event => this.calibrate()}
                                            >
                                                <i className="fa fa-bullseye" />
                                                {i18n._('Calibrate')}
                                            </Button>
                                        </div>
                                    )}
                                    {isCalibrating && (i18n._('Calibrating') + '...')}
                                    {!canCalibrate && !isCalibrating && !hasCalibrationResult && (
                                        <div>
                                            {calibrated && (
                                                <span style={{ fontStyle: 'italic' }}>
                                                    {'Calibration results have been applied.'}
                                                    <br /><br />
                                                    {'You can run calibration again now, or close this dialog.'}
                                                </span>
                                            )}
                                            {!calibrated && (
                                                <span style={{ fontStyle: 'italic' }}>
                                                    {'Once all measurements have been entered, the "Calibrate" button will appear.'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <br />
                                    {!hasCalibrationResult && (
                                        <Button
                                            btnSize="medium"
                                            btnStyle="flat"
                                            onClick={event => this.moveToCenter()}
                                        >
                                            <i className="fa fa-bullseye" />
                                            {i18n._('Move to Center')}
                                        </Button>
                                    )}
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
                            <a href="http://www.makerverse.com/machines/cnc/maslow/" target="_blank" rel="noopener noreferrer">
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
