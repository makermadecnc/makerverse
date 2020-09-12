import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Workspaces from 'app/lib/workspaces';
import Keypad from 'app/widgets/Axes/Keypad';
import {
    METRIC_UNITS,
} from '../../constants';
// import i18n from 'app/lib/i18n';

class MeasureChainsFlow extends PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        calibration: PropTypes.object.isRequired,
        callback: PropTypes.func.isRequired,
    };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    pages = ['Preparation', 'Alignment', 'Slack', 'Attachment', 'Measurement'];

    state = {
        page: this.pages[0],
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
    };

    runHoming() {
        if (this.state.hasHomed) {
            return;
        }
        this.workspace.controller.command('homing');
        this.setState({ hasHomed: true });
    }

    get pageNum() {
        return this.pages.indexOf(this.state.page);
    }

    set pageNum(pn) {
        pn = Math.max(0, Math.min(pn, this.pages.length - 1));
        this.setState({ page: this.pages[pn] });
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

    updateJogStep(callback) {
        const v = callback(this.state.jog.metric.step);
        const metricJogSteps = this.workspace.metricJogSteps;
        const step = Math.max(0, Math.min(v, metricJogSteps.length - 1));
        this.setState({
            jog: {
                metric: {
                    step: step,
                }
            }
        });
    }

    keypadActions = {
        getJogDistance: () => {
            const step = this.state.jog.metric.step;
            const metricJogSteps = this.workspace.metricJogSteps;
            const distance = Number(metricJogSteps[step]) || 0;
            return distance;
        },
        stepBackward: () => {
            this.updateJogStep((v) => v - 1);
        },
        stepForward: () => {
            this.updateJogStep((v) => v + 1);
        },
        selectStep: (step) => {
            this.updateJogStep((v) => Number(v));
        },
    };

    renderShuttleControls(axes = ['x', 'y']) {
        return (
            <center>
                <div style={{ maxWidth: '400px' }}>
                    <Keypad
                        workspaceId={this.workspace.id}
                        canClick={true}
                        units={METRIC_UNITS}
                        axes={axes}
                        jog={this.state.jog}
                        actions={this.keypadActions}
                    />
                </div>
            </center>
        );
    }

    renderNextPage() {
        return (
            <button
                type="button"
                className="btn btn-medium btn-primary"
                onClick={() => this.nextPage()}
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

    applyResults() {
        this.props.callback(this.state.yPos);
    }

    renderFinish() {
        return (
            <button
                type="button"
                className="btn btn-medium btn-warning"
                onClick={() => {
                    this.applyResults();
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
                Otherwise, remove the sled from the chain by detaching the collet pins from the ends of the chains.
                <br />
                Take one of the collet pins and insert it through the hole at the tip of both chains, so they are attached together.
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
                <h3>Align the Collet Pin</h3>
                The goal of this step is for the two chains to be <strong>exactly</strong> the same length.
                <br /><br />
                The simplest way to do this is:
                <br />
                - Use the Y axis controls to pull the chain taut.<br />
                - Use the X axis controls to ensure the collet pin is exactly at the middle of the top beam.<br />
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
                Use the Y axis controls to move the collet pin downward.
                <br />
                Keep doing so until you have enough slack to attach the sled (but do NOT attach it yet!)
                <br />
                As you do so, notice that the collet pin should remain in the <strong>exact center</strong> of the workspace.
                <br />
                If it fails to do so: either your chains were not an identical length, or your frame is not sufficiently level.
                <br /><br />
                This is a good opportunity to make a pen mark on the spoilboard along this X-center.
                <br />
                This way, it is easy to ensure stock is centered when it is loaded.
                <br /><br />
                {this.renderShuttleControls(['y'])}
                <hr style={{ marginTop: '10px', marginBottom: '10px', maxWidth: '400px' }} />
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
                <br /><br />
                {'Once this chain calibration tab is complete, you can use this as your "Reset Chains" location.'}<br />
                {'Simply return the sprockets & chains to this location, and then press "Reset Chains."'}<br />
                This will tell the Maslow that the chains are back at the well-known length.<br />
                But first, we need to finish this chain calibration tab so that we can calculate the length.<br />
                {this.renderToolbar(this.renderPrevPage(), this.renderNextPage())}
            </div>
        );
    }

    renderMeasurement() {
        return (
            <div>
                <h3>Measure Actual Location</h3>
                Make a mark where the bit (end-mill) touches the stock.
                <br />
                Measure the distance from the top of the stock to this location.
                <br /><br />
                <input
                    type="text"
                    name="yPos"
                    value={this.state.yPos}
                    onChange={e => {
                        this.setState({ yPos: e.target.value });
                    }}
                />
                <br />
                {this.renderToolbar(this.renderRestart(), this.renderFinish())}
            </div>
        );
    }

    render() {
        // TODO: before shutting, run Home. We know there's no chain sag already.
        return this[`render${this.state.page}`]();
    }
}

export default MeasureChainsFlow;
