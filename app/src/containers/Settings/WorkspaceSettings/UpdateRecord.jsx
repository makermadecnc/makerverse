import _get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Field } from 'react-final-form';
import { Input } from 'components-old/FormControl';
import FormGroup from 'components-old/FormGroup';
import { FlexContainer, Row, Col } from 'components-old/GridSystem';
import Margin from 'components-old/Margin';
import Modal from 'components-old/Modal';
import { ToastNotification } from 'components-old/Notifications';
import SectionGroup from 'components-old/SectionGroup';
import SectionTitle from 'components-old/SectionTitle';
import i18n from 'lib/i18n';
import Error from '../common/Error';
import * as validations from '../common/validations';
import AxisLabel from './AxisLabel';

class UpdateRecord extends Component {
  static propTypes = {
    state: PropTypes.object,
    actions: PropTypes.object,
  };

  state = this.getInitialState();

  sanitizeAxis(axis) {
    return {
      min: Number(_get(axis, 'min')) || 0,
      max: Number(_get(axis, 'max')) || 0,
      precision: Number(_get(axis, 'precision')) || 0,
      accuracy: Number(_get(axis, 'accuracy')) || 0,
    };
  }

  sanitizeValues(values) {
    return {
      name: _get(values, 'name', ''),
      axes: {
        x: this.sanitizeAxis(_get(values, 'axes.x', {})),
        y: this.sanitizeAxis(_get(values, 'axes.y', {})),
        z: this.sanitizeAxis(_get(values, 'axes.z', {})),
      },
    };
  }

  getInitialState() {
    const values = this.props.state.modal.params;

    return { values: this.sanitizeValues(values) };
  }

  onSubmit = (values) => {
    const { id } = this.props.state.modal.params;
    const { updateRecord } = this.props.actions;

    updateRecord(id, this.sanitizeValues(values));
  };

  renderAxis = (axisKey) => (
    <FlexContainer fluid gutterWidth={0}>
      <Row>
        <Col>
          <Field name={`axes.${axisKey}.min`}>
            {({ input, meta }) => (
              <FormGroup>
                <label>
                  <AxisLabel value={axisKey.toUpperCase()} sub='min' />
                </label>
                <Input {...input} type='number' />
                {meta.touched && meta.error && <Error>{meta.error}</Error>}
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col width='auto' style={{ width: 16 }} />
        <Col>
          <Field name={`axes.${axisKey}.max`}>
            {({ input, meta }) => (
              <FormGroup>
                <label>
                  <AxisLabel value={axisKey.toUpperCase()} sub='max' />
                </label>
                <Input {...input} type='number' />
                {meta.touched && meta.error && <Error>{meta.error}</Error>}
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col>
          <Field name={`axes.${axisKey}.precision`}>
            {({ input, meta }) => (
              <FormGroup>
                <label>
                  <AxisLabel value={axisKey.toUpperCase()} sub='precision' />
                </label>
                <Input {...input} type='number' />
                {meta.touched && meta.error && <Error>{meta.error}</Error>}
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col width='auto' style={{ width: 16 }} />
        <Col>
          <Field name={`axes.${axisKey}.accuracy`}>
            {({ input, meta }) => (
              <FormGroup>
                <label>
                  <AxisLabel value={axisKey.toUpperCase()} sub='accuracy' />
                </label>
                <Input {...input} type='number' />
                {meta.touched && meta.error && <Error>{meta.error}</Error>}
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </FlexContainer>
  );

  render() {
    const { closeModal, updateModalParams } = this.props.actions;
    const { alertMessage } = this.props.state.modal.params;

    return (
      <Modal disableOverlay onClose={closeModal}>
        <Form
          initialValues={this.state.values}
          onSubmit={this.onSubmit}
          render={({ handleSubmit, pristine, invalid }) => (
            <div>
              <Modal.Header>
                <Modal.Title>{i18n._('Workspace Profile')}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {alertMessage && (
                  <ToastNotification
                    style={{ margin: '-16px -24px 10px -24px' }}
                    type='error'
                    onDismiss={() => {
                      updateModalParams({ alertMessage: '' });
                    }}>
                    {alertMessage}
                  </ToastNotification>
                )}
                <SectionGroup>
                  <Field name='name' validate={validations.required}>
                    {({ input, meta }) => (
                      <FormGroup>
                        <label>{i18n._('Name')}</label>
                        <Input {...input} type='text' />
                        {meta.touched && meta.error && <Error>{meta.error}</Error>}
                      </FormGroup>
                    )}
                  </Field>
                </SectionGroup>
                <SectionGroup style={{ marginBottom: 0 }}>
                  <SectionTitle>X</SectionTitle>
                  <Margin left={24}>{this.renderAxis('x')}</Margin>
                </SectionGroup>
                <SectionGroup style={{ marginBottom: 0 }}>
                  <SectionTitle>Y</SectionTitle>
                  <Margin left={24}>{this.renderAxis('y')}</Margin>
                </SectionGroup>
                <SectionGroup style={{ marginBottom: 0 }}>
                  <SectionTitle>Z</SectionTitle>
                  <Margin left={24}>{this.renderAxis('z')}</Margin>
                </SectionGroup>
              </Modal.Body>
              <Modal.Footer>
                <button type='button' className='btn btn-default' onClick={closeModal}>
                  {i18n._('Cancel')}
                </button>
                <button type='button' className='btn btn-primary' disabled={pristine || invalid} onClick={handleSubmit}>
                  {i18n._('OK')}
                </button>
              </Modal.Footer>
            </div>
          )}
        />
      </Modal>
    );
  }
}

export default UpdateRecord;
