import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button } from 'app/components/Buttons';
import Modal from 'app/components/Modal';
import { Nav, NavItem } from 'app/components/Navs';
import i18n from 'app/lib/i18n';
import controller from 'app/lib/controller';
import styles from './index.styl';
import MaslowCalibration from './MaslowCalibration';

const defaultMeasurements = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
};

class Calibration extends PureComponent {
    calibration = new MaslowCalibration();

    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    state = {
        activeTab: 'home',
        cutDepth: 3, // mm to cut in the calibration pattern (zero = no cutting)
        measurements: defaultMeasurements,
        calibrating: -1,
        result: false
    };

    handleMeasurement(idx, val) {
        this.setState({ measurements: { ...this.state.measurements, [idx]: val } });
    }

    updateCalibration(percent) {
        this.setState({ calibrating: percent });
    }

    calibrate() {
        const input = this.state.measurements;
        const measurements = Object.keys(input).map((i) => {
            return input[i];
        });
        this.calibration.opts.cutDepth = this.state.cutDepth;
        this.calibration.recomputeIdeals();
        this.setState({ calibrating: 0 });
        // Let the UI update before beginning this long operation...
        setTimeout(() => {
            const res = this.calibration.calibrate(measurements, this.updateCalibration.bind(this));
            this.setState({ result: res, calibrating: -1 });
        }, 10);
    }

    applyResults() {
        const settings = this.calibration.kin.getSettingsMap();
        const sks = Object.keys(settings);
        controller.writeln('$X');
        Object.keys(this.state.result.optimized).forEach((k) => {
            if (!sks.includes(k)) {
                return;
            }
            const name = settings[k].name;
            const val = this.state.result.optimized[k];
            const cmd = `${name}=${val}`;
            console.log('setting', cmd);
            controller.writeln(cmd);
        });
    }

    render() {
        const { actions } = this.props;
        const edge = '0%';
        const inset = '10%';
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
        const { activeTab } = this.state;
        console.log('state', this.state);
        const height = Math.max(window.innerHeight / 2, 200);

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
                        <NavItem eventKey="home">{i18n._('Set Home')}</NavItem>
                        <NavItem eventKey="edge">{i18n._('Edge Calibration')}</NavItem>
                    </Nav>
                    <div className={styles.navContent} style={{ height: height }}>
                        {activeTab === 'home' && (
                            <div>
                            </div>
                        )}
                        {activeTab === 'edge' && (
                            <div>
                                <div style={{ margin: 'auto', position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }} >
                                    {this.state.calibrating >= 0 && (
                                        <div>
                                            Calibrating...
                                        </div>
                                    )}
                                    {(this.state.calibrating < 0) && (
                                        <Button
                                            btnSize="lg"
                                            btnStyle="flat"
                                            style={{ position: 'absolute', top: '50%', left: '50%' }}
                                            onClick={event => this.calibrate()}
                                        >
                                            <i className="fa fa-bullseye" />
                                            {i18n._('Calibrate')}
                                        </Button>
                                    )}

                                    {(this.state.calibrating < 0 && this.state.result) && (
                                        <div>
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
                                                        <td>{this.state.result.orig.avgErrDist}</td>
                                                        <td>{this.state.result.optimized.avgErrDist}</td>
                                                        <td>{this.state.result.change.avgErrDist}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Err Distance (mm)</td>
                                                        <td>{this.state.result.orig.totalErrDist}</td>
                                                        <td>{this.state.result.optimized.totalErrDist}</td>
                                                        <td>{this.state.result.change.totalErrDist}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Max Err Distance (mm)</td>
                                                        <td>{this.state.result.orig.maxErrDist}</td>
                                                        <td>{this.state.result.optimized.maxErrDist}</td>
                                                        <td>{this.state.result.change.maxErrDist}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <Button
                                                btnSize="lg"
                                                btnStyle="flat"
                                                style={{ position: 'absolute', top: '50%', left: '50%' }}
                                                onClick={event => this.applyResults()}
                                            >
                                                <i className="fa fa-check" />
                                                {i18n._('Apply Calibration Results')}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {Object.keys(this.state.measurements).map((i) => {
                                        const v = this.state.measurements[i];
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
                                                this.handleMeasurement(i, Number(e.target.value) || 0);
                                            }}
                                        />);
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={actions.closeModal}>
                        {i18n._('Close')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Calibration;
