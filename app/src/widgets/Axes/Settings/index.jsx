import ensureArray from 'ensure-array';
import styled from 'styled-components';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import api from 'api';
import { Button } from 'components-old/Buttons';
import Modal from 'components-old/Modal';
import Workspaces from 'lib/workspaces';
import { Nav, NavItem } from 'components-old/Navs';
import i18n from 'lib/i18n';
import General from './General';
import { MDI } from './MDI';
import ShuttleXpress from './ShuttleXpress';
import { DEFAULT_AXES } from '../constants';

const TabContent = styled.div`
  padding: 10px 15px;
  min-height: 240px;
`;

const TabPane = styled.div`
  display: ${(props) => (props.active ? 'block' : 'none')};
`;

class Settings extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  static defaultProps = {
    onSave: noop,
    onCancel: noop,
  };

  config = this.props.config;

  node = {
    general: null,
    mdi: null,
    shuttleXpress: null,
  };

  state = {
    activeKey: 'general',

    // General
    general: {
      axes: this.config.get('axes', DEFAULT_AXES),
      jog: {
        imperial: {},
        metric: {},
      },
    },

    // ShuttleXpress
    shuttleXpress: {
      feedrateMin: this.config.get('shuttle.feedrateMin'),
      feedrateMax: this.config.get('shuttle.feedrateMax'),
      hertz: this.config.get('shuttle.hertz'),
      overshoot: this.config.get('shuttle.overshoot'),
    },
  };

  save = () => {
    // MDI
    const { records } = this.node.mdi.state;
    api.mdi
      .bulkUpdate({ records: records })
      .then(() => {
        // TODO
      })
      .catch(() => {
        // TODO
      });

    // General
    const { axes = DEFAULT_AXES } = this.node.general.value;

    this.config.replace('axes', ensureArray(axes));

    // ShuttleXpress
    const { feedrateMin, feedrateMax, hertz, overshoot } = this.node.shuttleXpress.state;
    this.config.set('shuttle.feedrateMin', feedrateMin);
    this.config.set('shuttle.feedrateMax', feedrateMax);
    this.config.set('shuttle.hertz', hertz);
    this.config.set('shuttle.overshoot', overshoot);
  };

  render() {
    const { general, shuttleXpress } = this.state;

    return (
      <Modal disableOverlay size='md' onClose={this.props.onCancel}>
        <Modal.Header>
          <Modal.Title>{i18n._('Axes Settings')}</Modal.Title>
        </Modal.Header>
        <Modal.Body padding={false}>
          <Nav
            navStyle='tabs'
            activeKey={this.state.activeKey}
            onSelect={(eventKey) => {
              this.setState({ activeKey: eventKey });
            }}
            style={{
              marginTop: 15,
              paddingLeft: 15,
            }}>
            <NavItem eventKey='general'>{i18n._('General')}</NavItem>
            <NavItem eventKey='mdi'>{i18n._('Custom Commands')}</NavItem>
            <NavItem eventKey='shuttleXpress'>{i18n._('ShuttleXpress')}</NavItem>
          </Nav>
          <TabContent>
            <TabPane active={this.state.activeKey === 'general'}>
              <General
                ref={(node) => {
                  this.node.general = node;
                }}
                axes={general.axes}
              />
            </TabPane>
            <TabPane active={this.state.activeKey === 'mdi'}>
              <MDI
                workspaceId={this.workspace.id}
                ref={(node) => {
                  this.node.mdi = node;
                }}
              />
            </TabPane>
            <TabPane active={this.state.activeKey === 'shuttleXpress'}>
              <ShuttleXpress
                ref={(node) => {
                  this.node.shuttleXpress = node;
                }}
                feedrateMin={shuttleXpress.feedrateMin}
                feedrateMax={shuttleXpress.feedrateMax}
                hertz={shuttleXpress.hertz}
                overshoot={shuttleXpress.overshoot}
              />
            </TabPane>
          </TabContent>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onCancel}>{i18n._('Cancel')}</Button>
          <Button
            btnStyle='primary'
            onClick={(event) => {
              this.save();

              // Update parent state
              this.props.onSave(event);
            }}>
            {i18n._('Save Changes')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Settings;
