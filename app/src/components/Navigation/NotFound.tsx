import { Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import {useMakerverseTrans} from '../../providers';

const NotFound: FunctionComponent = () => {
  const t = useMakerverseTrans();

  return (<div style={{ padding: 10 }}>
    <Typography variant="h4" >{t('Not Found')}</Typography>
    {t('Whoops! Looks like you\'ve stumbled on an invalid page.')}
  </div>);
};

export default NotFound;
