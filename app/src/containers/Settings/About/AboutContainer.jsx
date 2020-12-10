import PropTypes from 'prop-types';
import React from 'react';
import Anchor from 'components-old/Anchor';
import settings from 'config/settings';
import i18n from 'lib/i18n';
import styles from './index.styl';

const AboutContainer = ({ version }) => {
  const wiki = 'http://www.makerverse.com/';

  return (
    <div className={styles.aboutContainer}>
      <img src='images/logo-badge-32x32.png' alt='' className={styles.productLogo} style={{ maxWidth: '32px' }} />
      <div className={styles.productDetails}>
        <div className={styles.aboutProductName}>
          {`${settings.productName} v${version.currentVersion.readable}`}
          <hr />
        </div>
        <div className={styles.aboutProductDescription}>Build #{version.currentVersion.build}</div>
        <div className={styles.aboutProductDescription}>
          A collarboration between MakerMade and OpenWorkShop.
          <br />
          Forked from the CNCjs project.
        </div>
        <Anchor className={styles.learnmore} href={wiki} target='_blank'>
          {i18n._('Learn more')}
          <i className='fa fa-arrow-circle-right' style={{ marginLeft: 5 }} />
        </Anchor>
      </div>
    </div>
  );
};

AboutContainer.propTypes = {
  version: PropTypes.object,
};

export default AboutContainer;
