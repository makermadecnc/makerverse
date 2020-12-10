import React from 'react';
import { Button } from 'components-old/Buttons';
import ModalTemplate from 'components-old/ModalTemplate';
import Modal from 'components-old/Modal';
import i18n from 'lib/i18n';

const reloadPage = (forcedReload = true) => {
  // Reload the current page, without using the cache
  window.location.reload(forcedReload);
};

const ServerDisconnected = (props) => (
  <Modal size='xs' disableOverlay={true} showCloseButton={false}>
    <Modal.Body>
      <ModalTemplate type='error'>
        <h5>{i18n._('Server has stopped working')}</h5>
        <p>
          {i18n._('A problem caused the server to stop working correctly. Check out the server status and try again.')}
        </p>
      </ModalTemplate>
    </Modal.Body>
    <Modal.Footer>
      <Button btnStyle='primary' onClick={reloadPage}>
        {i18n._('Reload')}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ServerDisconnected;
