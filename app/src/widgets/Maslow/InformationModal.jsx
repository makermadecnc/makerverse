import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Button } from 'components-old/Buttons';
import Modal from 'components-old/Modal';
import { Nav, NavItem } from 'components-old/Navs';
import Workspaces from 'lib/workspaces';
import i18n from 'lib/i18n';
import MaslowKinematics from 'lib/Maslow/MaslowKinematics';
import styles from './index.styl';

class InformationModal extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    state: PropTypes.object,
    actions: PropTypes.object,
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  kinematics = new MaslowKinematics(this.workspace.controller);

  updateChains(pos) {
    pos = { ...this.kinematics.lastPosition, ...pos };
    this.kinematics.positionToChain(pos.x, pos.y);
    this.kinematics.lastPosition = pos;
    this.forceUpdate();
  }

  updatePosition(leftChain, rightChain) {
    leftChain = leftChain > 0 ? leftChain : this.kinematics.lastChains[0];
    rightChain = rightChain > 0 ? rightChain : this.kinematics.lastChains[1];
    this.kinematics.chainToPosition(leftChain, rightChain);
    this.kinematics.lastChains = [leftChain, rightChain];
    this.forceUpdate();
  }

  updateKinematicsOpts(opts) {
    this.kinematics.recomputeGeometry(opts);
    this.forceUpdate();
  }

  render() {
    const { state, actions } = this.props;
    const { activeTab = 'state' } = state.modal.params;
    const height = Math.max(window.innerHeight / 2, 200);

    return (
      <Modal disableOverlay size='lg' onClose={actions.closeModal}>
        <Modal.Header>
          <Modal.Title>Maslow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav
            navStyle='tabs'
            activeKey={activeTab}
            onSelect={(eventKey, event) => {
              actions.updateModalParams({ activeTab: eventKey });
            }}
            style={{ marginBottom: 10 }}>
            <NavItem eventKey='state'>{i18n._('Controller State')}</NavItem>
            <NavItem eventKey='settings'>{i18n._('Controller Settings')}</NavItem>
            <NavItem eventKey='kinematics'>{i18n._('Kinematics')}</NavItem>
          </Nav>
          <div className={styles.navContent} style={{ height: height }}>
            {activeTab === 'state' && (
              <div className={styles.code}>
                <pre className={styles.pre}>
                  <code>{JSON.stringify(state.controller.state, null, 4)}</code>
                </pre>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className={styles.code}>
                <Button
                  btnSize='xs'
                  btnStyle='flat'
                  style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                  }}
                  onClick={(event) => {
                    this.workspace.controller.command('about');
                  }}>
                  <i className='fa fa-refresh' />
                  {i18n._('Refresh')}
                </Button>
                <pre className={styles.pre}>
                  <code>{JSON.stringify(state.controller.settings, null, 4)}</code>
                </pre>
              </div>
            )}
            {activeTab === 'kinematics' && (
              <div>
                <textarea
                  style={{ width: '100%' }}
                  name='settings'
                  value={JSON.stringify(this.kinematics.opts)}
                  onChange={(e) => {
                    this.updateKinematicsOpts(JSON.parse(e.target.value));
                  }}
                />
                <div>
                  X:{' '}
                  <input
                    type='text'
                    name='xPos'
                    value={this.kinematics.lastPosition.x}
                    onChange={(e) => {
                      this.updateChains({ x: Number(e.target.value) });
                    }}
                  />
                  Y:{' '}
                  <input
                    type='text'
                    name='yPos'
                    value={this.kinematics.lastPosition.y}
                    onChange={(e) => {
                      this.updateChains({ y: Number(e.target.value) });
                    }}
                  />
                </div>
                <div>
                  Left Chain Length:{' '}
                  <input
                    type='text'
                    name='leftChain'
                    value={this.kinematics.lastChains[0]}
                    onChange={(e) => {
                      this.updatePosition(Number(e.target.value), -1);
                    }}
                  />
                  Right Chain Length:{' '}
                  <input
                    type='text'
                    name='rightChain'
                    value={this.kinematics.lastChains[1]}
                    onChange={(e) => {
                      this.updatePosition(-1, Number(e.target.value));
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={actions.closeModal}>{i18n._('Close')}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default InformationModal;
