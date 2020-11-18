import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Anchor from 'components-old/Anchor';
import { Space } from 'components-old/';
import settings from 'config/settings';
import i18n from 'lib/i18n';
import analytics from 'lib/analytics';
import styles from './index.styl';

const UpdateStatusContainer = (props) => {
  const { version } = props;
  const { checking, latestVersion, lastUpdate, updateAvailable, updateUrl } = version;

  if (checking) {
    return (
      <div className={styles.updateStatusContainer}>
        <div className={styles.updateStatusIcon}>
          <i className='fa fa-fw fa-spin fa-circle-o-notch' />
        </div>
        <div className={styles.updateStatusMessageContainer}>
          <div className={styles.updateStatusMessage}>{i18n._('Checking for updates...')}</div>
        </div>
      </div>
    );
  }

  if (updateAvailable) {
    return (
      <div className={styles.updateStatusContainer}>
        <div className={classNames(styles.updateStatusIcon, styles.warning)}>
          <i className='fa fa-exclamation-circle fa-fw' />
        </div>
        <div className={styles.updateStatusMessageContainer}>
          <div className={styles.updateStatusMessage}>
            {i18n._('A new version of {{name}} is available', { name: settings.productName })}
            <br />
            <analytics.OutboundLink
              eventLabel='update'
              to='http://www.makerverse.com/installation/updating/'
              target='_blank'>
              {i18n._('Need help updating?')}
            </analytics.OutboundLink>
          </div>
          <div className={styles.releaseLatest}>
            {i18n._('Version {{version}}', { version: latestVersion.readable })}
            <br />
            {moment(lastUpdate).format('LLL')}
          </div>
        </div>
        <div className={styles.updateStatusActionContainer}>
          <Anchor href={updateUrl} target='_blank'>
            <span className={styles.label}>
              {i18n._('Latest version')}
              <Space width='8' />
              <i className='fa fa-external-link fa-fw' />
            </span>
          </Anchor>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.updateStatusContainer}>
      <div className={classNames(styles.updateStatusIcon, styles.info)}>
        <i className='fa fa-check-circle fa-fw' />
      </div>
      <div className={styles.updateStatusMessageContainer}>
        <div className={styles.updateStatusMessage}>
          {i18n._('You already have the newest version of {{name}} ({{version}})', {
            name: settings.productName,
            version: latestVersion.readable,
          })}
        </div>
      </div>
    </div>
  );
};

UpdateStatusContainer.propTypes = {
  version: PropTypes.shape({
    checking: PropTypes.bool,
    updateAvailable: PropTypes.bool.isRequired,
    latestVersion: PropTypes.object.isRequired,
    lastUpdate: PropTypes.string.isRequired,
    updateUrl: PropTypes.string,
  }).isRequired,
};

export default UpdateStatusContainer;
