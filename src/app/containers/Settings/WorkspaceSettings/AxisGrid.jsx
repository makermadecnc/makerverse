import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'app/components/FormControl';
import { FlexContainer, Row, Col } from 'app/components/GridSystem';
import AxisLabel from './AxisLabel';

const GetField = ({ onChange, key, axis }) => (
    onChange ? (
        <Input
            type="number"
            name={key}
            min={-10000}
            max={10000}
            className="form-control"
            placeholder={key}
            value={axis[key]}
            onChange={e => onChange(key, e.target.value)}
        />
    ) : <span>{axis[key]}</span>
);

const AxisGrid = ({ onChange, name, axis }) => (
    <FlexContainer fluid gutterWidth={0}>
        <Row>
            <Col width="auto">
                <div>
                    <AxisLabel value={name} sub="min" />
                    {' = '}{GetField({ onChange, key: 'min', axis: axis })}
                </div>
                <div>
                    <AxisLabel value={name} sub="max" />
                    {' = '}{GetField({ onChange, key: 'max', axis: axis })}
                </div>
            </Col>
            <Col width="auto" style={{ width: 16 }} />
            <Col width="auto">
                <div>
                    <AxisLabel value={name} sub="precision" />
                    {' = '}{GetField({ onChange, key: 'precision', axis: axis })}
                </div>
                <div>
                    <AxisLabel value={name} sub="accuracy" />
                    {' = '}{GetField({ onChange, key: 'accuracy', axis: axis })}
                </div>
            </Col>
        </Row>
    </FlexContainer>
);

AxisGrid.propTypes = {
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    axis: PropTypes.shape({
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        accuracy: PropTypes.number.isRequired,
        precision: PropTypes.number.isRequired,
    }).isRequired,
};

export default AxisGrid;
