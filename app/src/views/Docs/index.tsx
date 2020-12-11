import {useNetworkStatus} from '@openworkshop/lib/utils/device';
import React, { FunctionComponent } from 'react';
import settings from '../../config/settings';
import {OfflineAlertList} from '@openworkshop/ui/components/Alerts';
import {useMakerverse, useMakerverseTrans} from '../../providers';

const Docs: FunctionComponent = () => {
  const isOnline = useNetworkStatus();
  const t = useMakerverseTrans();
  const fs = { width: '100%', height: '100%' };

  if (!isOnline) {
    return <OfflineAlertList feature={t('The {{ productName }} documentation', settings)} />;
  }

  return (
    <div style={{ ...fs, position: 'absolute', marginLeft: -200 }}>
      <iframe
        src="http://makerverse.com"
        style={{ ...fs, display: 'block', border: 'none', margin: '0 auto' }}
      />
    </div>
  );
};

export default Docs;
