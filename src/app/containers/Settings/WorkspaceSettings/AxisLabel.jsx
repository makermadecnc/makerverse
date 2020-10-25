import PropTypes from 'prop-types';
import React from 'react';

const AxisLabel = ({ value, sub }) => (
    <div style={{ display: 'inline-block' }}>
        {value}
        <sub style={{ marginLeft: 2 }}>{sub} (mm)</sub>
    </div>
);

AxisLabel.propTypes = {
    value: PropTypes.string,
    sub: PropTypes.string,
};

export default AxisLabel;
