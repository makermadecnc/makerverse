import React from 'react';
import store from 'store';
import chainedFunction from 'chained-function';
import i18n from 'lib/i18n';
import Modal from 'components/Modal';
import ModalTemplate from 'components/ModalTemplate';
import Anchor from 'components/Anchor';
import { Button } from 'components/Buttons';
import Space from 'components/Space';

const AppCorrupted = () => {
    const text = store.getConfig();
    const url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
    const filename = `${settings.name}-${settings.version.full}.json`;

    const onClose = () => {
        window.location.reload();
    };

    return (
        <Modal
            onClose={onClose}
            disableOverlay={true}
            showCloseButton={false}
        >
            <Modal.Body>
                <ModalTemplate type="error">
                    <h5>{i18n._('Corrupted workspace settings')}</h5>
                    <p>{i18n._('The workspace settings have become corrupted or invalid. Click Restore Defaults to restore default settings and continue.')}</p>
                    <div>
                        <Anchor
                            href={url}
                            download={filename}
                        >
                            <i className="fa fa-download" />
                            <Space width="4" />
                            {i18n._('Download workspace settings')}
                        </Anchor>
                    </div>
                </ModalTemplate>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    btnStyle="danger"
                    onClick={chainedFunction(
                        store.resetDefaults,
                        onClose
                    )}
                >
                    {i18n._('Restore Defaults')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AppCorrupted;
