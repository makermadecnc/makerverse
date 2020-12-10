import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Modal from 'components-old/Modal';
import ToggleSwitch from 'components-old/ToggleSwitch';
import i18n from 'lib/i18n';

class RunProbe extends PureComponent {
  static propTypes = {
    state: PropTypes.object,
    actions: PropTypes.object,
  };

  render() {
    const { state, actions } = this.props;
    const { useTLO } = state;
    const probeCommands = actions.populateProbeCommands();
    const content = probeCommands.join('\n');

    return (
      <Modal disableOverlay size='sm' onClose={actions.closeModal}>
        <Modal.Header>
          <Modal.Title>{i18n._('Probe')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBottom: 10 }}>
            <ToggleSwitch checked={useTLO} size='sm' onChange={actions.toggleUseTLO} />
            {i18n._('Apply tool length offset')}
          </div>
          <pre style={{ minHeight: 240 }}>
            <code>{content}</code>
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <button type='button' className='btn btn-default' onClick={actions.closeModal}>
            {i18n._('Cancel')}
          </button>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              actions.closeModal();
              actions.runProbeCommands(probeCommands);
            }}>
            {i18n._('Run Probe')}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RunProbe;
