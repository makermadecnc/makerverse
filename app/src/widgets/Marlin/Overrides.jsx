import PropTypes from 'prop-types';
import React from 'react';
import RepeatButton from 'components/RepeatButton';
import DigitalReadout from './DigitalReadout';
import styles from './index.styl';

const Overrides = (props) => {
    const { ovF, ovS } = props;

    if (!ovF && !ovS) {
        return null;
    }

    return (
        <div className={styles.overrides}>
            {!!ovF && (
                <DigitalReadout label="F" value={ovF + '%'}>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('feedOverride', -10);
                        }}
                    >
                        <i className="fa fa-arrow-down" style={{ fontSize: 14 }} />
                        <span style={{ marginLeft: 5 }}>
                            -10%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('feedOverride', -1);
                        }}
                    >
                        <i className="fa fa-arrow-down" style={{ fontSize: 10 }} />
                        <span style={{ marginLeft: 5 }}>
                            -1%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('feedOverride', 1);
                        }}
                    >
                        <i className="fa fa-arrow-up" style={{ fontSize: 10 }} />
                        <span style={{ marginLeft: 5 }}>
                            1%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('feedOverride', 10);
                        }}
                    >
                        <i className="fa fa-arrow-up" style={{ fontSize: 14 }} />
                        <span style={{ marginLeft: 5 }}>
                            10%
                        </span>
                    </RepeatButton>
                    <button
                        type="button"
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('feedOverride', 0);
                        }}
                    >
                        <i className="fa fa-undo fa-fw" />
                    </button>
                </DigitalReadout>
            )}
            {!!ovS && (
                <DigitalReadout label="E" value={ovS + '%'}>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('spindleOverride', -10);
                        }}
                    >
                        <i className="fa fa-arrow-down" style={{ fontSize: 14 }} />
                        <span style={{ marginLeft: 5 }}>
                            -10%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('spindleOverride', -1);
                        }}
                    >
                        <i className="fa fa-arrow-down" style={{ fontSize: 10 }} />
                        <span style={{ marginLeft: 5 }}>
                            -1%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('spindleOverride', 1);
                        }}
                    >
                        <i className="fa fa-arrow-up" style={{ fontSize: 10 }} />
                        <span style={{ marginLeft: 5 }}>
                            1%
                        </span>
                    </RepeatButton>
                    <RepeatButton
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('spindleOverride', 10);
                        }}
                    >
                        <i className="fa fa-arrow-up" style={{ fontSize: 14 }} />
                        <span style={{ marginLeft: 5 }}>
                            10%
                        </span>
                    </RepeatButton>
                    <button
                        type="button"
                        className="btn btn-default"
                        style={{ padding: 5 }}
                        onClick={() => {
                            props.controller.command('spindleOverride', 0);
                        }}
                    >
                        <i className="fa fa-undo fa-fw" />
                    </button>
                </DigitalReadout>
            )}
        </div>
    );
};

Overrides.propTypes = {
    controller: PropTypes.object.isRequired,
    ovF: PropTypes.number,
    ovS: PropTypes.number
};

export default Overrides;
