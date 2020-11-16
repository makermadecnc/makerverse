import PropTypes from 'prop-types';
import React from 'react';
import DisplayPanel from './DisplayPanel';
import Keypad from './Keypad';
import MDI from './MDI';

const Axes = (props) => {
    const { state, actions } = props;

    return (
        <div>
            <DisplayPanel
                workspaceId={props.workspaceId}
                canClick={state.canClick}
                units={state.units}
                axes={state.axes}
                machinePosition={state.machinePosition}
                workPosition={state.workPosition}
                jog={state.jog}
                actions={actions}
            />
            <Keypad
                workspaceId={props.workspaceId}
                canClick={state.canClick}
                canChangeUnits={true}
                units={state.units}
                axes={state.axes}
                jog={state.jog}
                actions={actions}
            />
            <MDI
                workspaceId={props.workspaceId}
                canClick={state.canClick}
                mdi={state.mdi}
            />
        </div>
    );
};

Axes.propTypes = {
    workspaceId: PropTypes.string.isRequired,
    state: PropTypes.object,
    actions: PropTypes.object
};

export default Axes;
