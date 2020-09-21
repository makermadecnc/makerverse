import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Workspaces from 'app/lib/workspaces';
import Keypad from 'app/widgets/Axes/Keypad';
import {
    IMPERIAL_UNITS,
} from 'app/constants';
// import i18n from 'app/lib/i18n';

class MeasureChainsFlow extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        calibration: PropTypes.object.isRequired,
        setChains: PropTypes.func.isRequired,
        setStep: PropTypes.func.isRequired,
        step: PropTypes.string,
        measureCenterOffset: PropTypes.func.isRequired,
        moveToCenter: PropTypes.func.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    pages = ['Preparation', 'Alignment', 'Slack', 'Attachment', 'Measurement', 'Axes'];

    state = {
        jog: {
            metric: {
                step: 0,
            },
            imperial: {
                step: 0,
            }
        },
        hasHomed: false,
        yPos: 0,
        xOff: 0,
        yOff: 0,
    };

    runHoming() {
        if (this.state.hasHomed) {
            return;
        }
        this.workspace.controller.command('homing');
        this.setState({ hasHomed: true });
    }

    get pageNum() {
        return this.pages.indexOf(this.props.step) || 0;
    }

    set pageNum(pn) {
        pn = Math.max(0, Math.min(pn, this.pages.length - 1));
        this.props.setStep(this.pages[pn]);
    }

    setPage(name) {
        this.pageNum = this.pages.indexOf(name);
    }

    nextPage() {
        this.pageNum += 1;
    }

    prevPage() {
        this.pageNum -= 1;
    }

    get isImperialUnits() {
        return this.props.units === IMPERIAL_UNITS;
    }

    updateJogStep(callback) {
        const key = this.isImperialUnits ? 'imperial' : 'metric';
        const v = callback(this.state.jog[key].step);
        const jogSteps = this.isImperialUnits ? this.workspace.imperialJogSteps : this.workspace.metricJogSteps;
        const step = Math.max(0, Math.min(v, jogSteps.length - 1));
        this.setState({
            jog: {
                [key]: {
                    step: step,
                }
            }
        });
    }

    keypadActions = {
        getJogDistance: () => {
            const key = this.isImperialUnits ? 'imperial' : 'metric';
            const step = this.state.jog[key].step;
            const jogSteps = this.isImperialUnits ? this.workspace.imperialJogSteps : this.workspace.metricJogSteps;
            const distance = Number(jogSteps[step]) || 0;
            return distance;
        },
        stepBackward: () => {
            this.updateJogStep((v) => v - 1);
        },
        stepForward: () => {
            this.updateJogStep((v) => v + 1);
        },
        selectStep: (step) => {
            this.updateJogStep((v) => Number(step));
        },
    };

    renderShuttleControls(axes = ['x', 'y']) {
        return (
            <center>
                <div style={{ maxWidth: '400px' }}>
                    <Keypad
                        workspaceId={this.workspace.id}
                        canClick={true}
                        canChangeUnits={false}
                        units={this.workspace.activeState.units}
                        axes={axes}
                        jog={this.state.jog}
                        actions={this.keypadActions}
                    />
                </div>
            </center>
        );
    }

    renderNextPage(action) {
        action = action || this.nextPage.bind(this);
        return (
            <button
                type="button"
                className="btn btn-medium btn-primary"
                onClick={() => action()}
            >
                Next
            </button>
        );
    }

    renderPrevPage() {
        return (
            <button
                type="button"
                className="btn btn-medium"
                onClick={() => this.prevPage()}
            >
                Previous
            </button>
        );
    }

    renderRestart() {
        return (
            <button
                type="button"
                className="btn btn-medium"
                onClick={() => {
                    this.pageNum = 0;
                }}
            >
                Return to Beginning
            </button>
        );
    }

    setChains() {
        this.props.setChains(Number(this.state.yPos));
        this.nextPage();
    }

    renderFinish() {
        return (
            <button
                type="button"
                className="btn btn-medium btn-warning"
                onClick={() => {
                    this.props.measureCenterOffset(Number(this.state.xOff), Number(this.state.yOff));
                }}
            >
                Finish & Apply Results
            </button>
        );
    }

    renderToolbar(left, right) {
        return (
            <center>
                <div style={{ maxWidth: '400px', textAlign: 'left', marginTop: '20px' }}>
                    {left}
                    {right && (
                        <div className="pull-right">
                            {right}
                        </div>
                    )}
                </div>
            </center>
        );
    }

    renderPreparation() {
        return (
            <div>
                <h3>Previously Calibrated?</h3>
                Were the chains on this machine previously calibrated?
                <br />
                {'Only select "Previously Calibrated" if you already have marks on the chains at a well-known length.'}
                <br />
                <br />
                <div >
                    <button
                        type="button"
                        className="btn btn-medium btn-warning"
                        onClick={() => this.setPage('Measurement')}
                    >
                        Chains Previously Calibrated
                    </button>
                </div>
                <br /><br />
                <h3>Measuring Chains</h3>
                Otherwise, remove the sled from the chain by detaching the Cotter pins from the ends of the chains.
                <br />
                Take one of the Cotter pins and insert it through the hole at the tip of both chains, so they are attached together.
                <br />
                <br />
                <div >
                    <button
                        type="button"
                        className="btn btn-medium btn-primary"
                        onClick={() => {
                            this.runHoming();
                            this.nextPage();
                        }}
                    >
                        Begin Measuring Chains
                    </button>
                </div>
            </div>
        );
    }

    renderAlignment() {
        return (
            <div>
                <h3>Align the Cotter Pin</h3>
                The goal of this step is for the two chains to be <strong>exactly</strong> the same length.
                <br /><br />
                The simplest way to do this is:
                <br />
                - Use the Y axis controls to pull the chain taut.<br />
                - Use the X axis controls to ensure the Cotter pin is exactly at the middle of the top beam.<br />
                <br /><br />
                {this.renderShuttleControls()}
                <hr />
                {this.renderToolbar(this.renderPrevPage(), this.renderNextPage())}
            </div>
        );
    }

    renderSlack() {
        return (
            <div>
                <h3>Let Slack the Chains</h3>
                Use the Y axis controls to move the Cotter pin downward.
                <br />
                Keep doing so until you have enough slack to attach the sled (but do NOT attach it yet!)
                <br />
                As you do so, notice that the Cotter pin should remain in the <strong>exact center</strong> of the workspace.
                <br />
                If it fails to do so: either your chains were not an identical length, or your frame is not sufficiently level.
                <br /><br />
                This is a good opportunity to make a pen mark on the spoilboard along this X-center.
                <br />
                This way, it is easy to ensure stock is centered when it is loaded.
                <br /><br />
                {this.renderShuttleControls(['y'])}
                <hr />
                {this.renderToolbar(this.renderPrevPage(), this.renderNextPage())}
            </div>
        );
    }

    renderAttachment() {
        return (
            <div>
                <h3>Attach the Sled</h3>
                - Make sure that both sprockets have a gear tooth pointing <strong>exactly</strong> upwards (12 o{'\''}clock).<br />
                - Use paint, a sharpie, nail polish, or similar to place a mark on the link of each chain which is overtop this top-tooth.<br />
                <br />
                <img style={{ maxHeight: '180px' }} alt="sprocket at noon" src="images/calibration_chain_noon.png" />
                {this.renderShuttleControls(['y'])}
                <br />
                {'Once this chain calibration tab is complete, you can use this as your "Reset Chains" location.'}<br />
                {'Simply return the sprockets & chains to this location, which should cause the chains to be precisely the same length as they are now.'}<br />
                {'Then, pressing "Reset Chains" will tell the Maslow they are back at this well-known length.'}<br />
                But first, we need to finish this chain calibration tab so that we can calculate the length.<br />
                <hr />
                {this.renderToolbar(this.renderPrevPage(), this.renderNextPage())}
            </div>
        );
    }

    renderMeasurement() {
        return (
            <div>
                <h3>Measure Actual Location</h3>
                Measure the distance from the <strong>top of the stock to the top edge of the sled</strong>.
                <br />
                Press the tape measure firmly against the sled.
                <br /><br />
                {'Distance from top: '}
                <input
                    type="text"
                    name="yPos"
                    value={this.state.yPos}
                    onChange={e => {
                        this.setState({ yPos: e.target.value });
                    }}
                />
                <hr />
                {this.renderToolbar(this.renderPrevPage(), this.renderNextPage(this.setChains.bind(this)))}
            </div>
        );
    }

    renderAxes() {
        return (
            <div>
                <h3>Axes Checks</h3>
                Ensure that the stock is loaded. Make a mark at the exact middle (0, 0).
                <br />
                {'When you press the "Move to Center" button below, the Maslow will try to move to this center location.'}
                <br />
                Once it is there, measure the distance from the <strong>tip of the end-mill</strong> to the center mark you made.
                <br />
                Use the Z-axis controls to help touch the tip to the stock.
                <br />
                <br />
                <button
                    type="button"
                    className="btn btn-medium btn-primary"
                    onClick={() => this.props.moveToCenter()}
                >
                    Move to Center
                </button>
                <br /><br /><br />
                {this.renderShuttleControls(['z'])}
                <br />
                {'X Offset: '}
                <input
                    type="text"
                    name="xOff"
                    value={this.state.xOff}
                    onChange={e => {
                        this.setState({ xOff: e.target.value });
                    }}
                />
                {' Y Offset: '}
                <input
                    type="text"
                    name="yOff"
                    value={this.state.yOff}
                    onChange={e => {
                        this.setState({ yOff: e.target.value });
                    }}
                />
                <hr />
                {this.renderToolbar(this.renderPrevPage(), this.renderFinish())}
            </div>
        );
    }

    render() {
        const step = this.props.step || this.pages[0];
        return this[`render${step}`]();
    }
}

export default MeasureChainsFlow;
