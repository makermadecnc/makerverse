import {useNetworkStatus} from '@openworkshop/lib/utils/device';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import OfflineAlert from '@openworkshop/ui/components/Alerts/OfflineAlert';
import settings from '../../config/settings';

const Docs: FunctionComponent = () => {
  const isOnline = useNetworkStatus();
  const { t } = useTranslation();
  const fs = { width: '100%', height: '100%' };

  if (!isOnline) {
    return <OfflineAlert feature={t('The {{ productName }} documentation', settings)} />;
  }

  return (
    <div style={{ ...fs, position: 'fixed', marginLeft: -24, marginTop: -22 }}>
      <iframe
        src="http://makerverse.com"
        style={{ ...fs, display: 'block', border: 'none', margin: '0 auto' }}
      />
    </div>
  );
};

export default Docs;
