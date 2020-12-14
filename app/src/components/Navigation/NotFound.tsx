import { Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import {useTrans} from '@openworkshop/ui/open-controller/Context';

const NotFound: FunctionComponent = () => {
  const t = useTrans();

  return (<div style={{ padding: 10 }}>
    <Typography variant="h4" >{t('Not Found')}</Typography>
    {t('Whoops! Looks like you\'ve stumbled on an invalid page.')}
  </div>);
};

export default NotFound;
