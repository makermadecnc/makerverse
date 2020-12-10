import { Typography } from '@material-ui/core';
import React, { FunctionComponent } from 'react';
import { Trans } from 'react-i18next';

const NotFound: FunctionComponent = () => {
  return (<div>
    <Typography variant="h4" ><Trans>Not Found</Trans></Typography>
    <Trans>Whoops! Looks like you've stumbled on an invalid page.</Trans>
  </div>);
};

export default NotFound;
