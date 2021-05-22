import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'app/components/Buttons';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import analytics from 'app/lib/analytics';
import Modal from 'app/components/Modal';
import Workspaces from 'app/lib/workspaces';
import {
    MODAL_CALIBRATION
} from './constants';

class OnboardingModal extends React.PureComponent {
    static propTypes = {
        workspaceId: PropTypes.string.isRequired,
        actions: PropTypes.object,
    };

    state = { wiping: false };

    get workspace() {
        return Workspaces.all[this.props.workspaceId];
    }

    closeModal(isNewMachine = false) {
        this.workspace.hasOnboarded = true;
        if (isNewMachine) {
            this.props.actions.openModal(MODAL_CALIBRATION);
        } else {
            this.props.actions.closeModal();
        }
    }

    event(opts) {
        analytics.event({
            ...{ category: 'interaction', action: 'press' },
            ...opts,
        });
    }

    wipe(settings) {
        this.event({ label: 'onboard' });

        const workspace = this.workspace;
        const grblSettings = {};
        _.filter(settings, { settingType: 'GRBL' }).forEach((s) => {
            grblSettings[s.key] = s.value;
        });
        log.debug('Wiping settings and applying', grblSettings);

        this.setState({ wiping: true });
        workspace.blockingText = i18n._('Preparing Machine...');
        workspace.controller.command('wipe');
        setTimeout(() => {
            workspace.machineSettings.write(grblSettings, () => {
                this.closeModal(true);
            });
        }, 2000);
    }

    renderNewMachinePrompt() {
        return (
            <div style={{ textAlign: 'center' }}>
                <h6>{i18n._('Is this a new machine?')}</h6>
                <i>{i18n._('Or, have you installed new firmware?')}</i>
                <hr />
                {i18n._('Selecting "yes" will reset (erase) and apply reccomended settings.')}
                <br/>
                {i18n._('Select "no" if your machine has already been calibrated.')}
            </div>
        );
    }

    render() {
        // const { actions } = this.props;
        const settings = this.workspace.partSettings;
        const showPrompt = !this.state.wiping;

        return (
            <Modal
                disableOverlay
                size="lg"
                onClose={() => this.closeModal()}
            >
                <Modal.Header>
                    <Modal.Title>
                        {i18n._('Welcome')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.wiping && (
                        <div>
                            {i18n._('Applying Settings...')}
                        </div>
                    )}
                    {showPrompt && this.renderNewMachinePrompt()}
                </Modal.Body>
                {showPrompt && (
                    <Modal.Footer>
                        <Button style={{ float: 'left' }} onClick={() => this.closeModal()}>
                            {i18n._('No')}
                        </Button>
                        <Button className="btn-primary" onClick={() => this.wipe(settings)}>
                            {i18n._('Yes')}
                        </Button>
                    </Modal.Footer>
                )}
            </Modal>
        );
    }
}

export default OnboardingModal;
