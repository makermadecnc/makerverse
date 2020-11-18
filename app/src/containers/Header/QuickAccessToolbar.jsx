import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Space } from 'components-old/';
import Workspaces from 'lib/workspaces';
import { Tooltip } from 'components-old/Tooltip';
import i18n from 'lib/i18n';
import analytics from 'lib/analytics';
import styles from './index.styl';

class QuickAccessToolbar extends PureComponent {
  static propTypes = {
    workspaceId: PropTypes.string.isRequired,
    state: PropTypes.object,
    actions: PropTypes.object,
  };

  get workspace() {
    return Workspaces.all[this.props.workspaceId];
  }

  event(opts) {
    analytics.event({
      ...{ category: 'interaction', action: 'press', label: 'quickaccess' },
      ...opts,
    });
  }

  command = {
    homing: () => {
      this.workspace.controller.command('homing');
      this.event({ label: 'homing' });
    },
    sleep: () => {
      this.workspace.controller.command('sleep');
      this.event({ label: 'sleep' });
    },
    unlock: () => {
      this.workspace.controller.command('unlock');
      this.event({ label: 'unlock' });
    },
    reset: () => {
      this.workspace.controller.command('reset');
      this.event({ label: 'reset' });
    },
  };

  renderButtonFeature(key, title, desc, icon, btnType, disabled = false) {
    const feature = this.workspace.getFeature(key, { title: title, description: desc || title, icon: icon });
    if (!feature) {
      return '';
    }
    const button = (
      <button
        type='button'
        className={'btn btn-' + (disabled ? 'link-disabled' : btnType)}
        onClick={this.command[key]}
        disabled={!!disabled}>
        {feature.icon && <i className={'fa ' + feature.icon} />}
        {feature.icon && <Space width='8' />}
        {i18n._(feature.title)}
      </button>
    );
    return disabled ? (
      button
    ) : (
      <Tooltip placement='bottom' style={{ color: '#fff' }} content={i18n._(feature.description)}>
        {button}
      </Tooltip>
    );
  }

  render() {
    return (
      <div className={styles.quickAccessToolbar}>
        <ul className='nav navbar-nav'>
          <li className='btn-group btn-group-sm' role='group'>
            {this.renderButtonFeature(
              'homing',
              'Set Home',
              'Set current position as machine home',
              'fa-home',
              'primary',
            )}
          </li>
        </ul>
      </div>
    );
  }
}

export default QuickAccessToolbar;
