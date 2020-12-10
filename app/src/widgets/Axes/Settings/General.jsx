import _includes from 'lodash/includes';
import _set from 'lodash/set';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Checkbox } from 'components-old/Checkbox';
import FormGroup from 'components-old/FormGroup';
import { FlexContainer, Row, Col } from 'components-old/GridSystem';
import Margin from 'components-old/Margin';
import { Space } from 'components-old/';
import i18n from 'lib/i18n';

class General extends PureComponent {
  static propTypes = {
    axes: PropTypes.array.isRequired,
  };

  field = {
    axisX: null,
    axisY: null,
    axisZ: null,
    axisA: null,
    axisB: null,
    axisC: null,
  };

  state = {};

  get value() {
    // Axes
    const axes = [];
    axes.push('x');
    this.field.axisY.checked && axes.push('y');
    this.field.axisZ.checked && axes.push('z');
    this.field.axisA.checked && axes.push('a');
    this.field.axisB.checked && axes.push('b');
    this.field.axisC.checked && axes.push('c');

    return {
      axes,
    };
  }

  withFieldRef = (key) => (node) => {
    _set(this.field, key, node);
  };

  render() {
    const { axes } = this.props;

    return (
      <FlexContainer fluid gutterWidth={0}>
        <Margin bottom={15}>
          <label>
            <strong>{i18n._('Axes')}</strong>
          </label>
          <Row>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisX')} checked disabled>
                  <Space width='8' />
                  {i18n._('X-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisY')} defaultChecked={_includes(axes, 'y')}>
                  <Space width='8' />
                  {i18n._('Y-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisZ')} defaultChecked={_includes(axes, 'z')}>
                  <Space width='8' />
                  {i18n._('Z-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisA')} defaultChecked={_includes(axes, 'a')}>
                  <Space width='8' />
                  {i18n._('A-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisB')} defaultChecked={_includes(axes, 'b')}>
                  <Space width='8' />
                  {i18n._('B-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
            <Col xs={4}>
              <FormGroup>
                <Checkbox ref={this.withFieldRef('axisC')} defaultChecked={_includes(axes, 'c')}>
                  <Space width='8' />
                  {i18n._('C-axis')}
                </Checkbox>
              </FormGroup>
            </Col>
          </Row>
        </Margin>
      </FlexContainer>
    );
  }
}

export default General;
