import React from 'react';
import ReactDOM from 'react-dom';
import WidgetManager from './WidgetManager';

// @param {string} targetContainer The target container: primary|secondary
export const show = (workspaceId, callback) => {
    const el = document.body.appendChild(document.createElement('div'));
    const handleClose = (e) => {
        ReactDOM.unmountComponentAtNode(el);
        setTimeout(() => {
            el.remove();
        }, 0);
    };

    ReactDOM.render(<WidgetManager workspaceId={workspaceId} onSave={callback} onClose={handleClose} />, el);
};
