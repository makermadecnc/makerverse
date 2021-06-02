import React from 'react';
import { getDevSemver } from '@openworkshop/maker-hub/utils/semvers';
import { makerHubMain, packageDeployment } from '@openworkshop/maker-hub/deployments';

makerHubMain(
  packageDeployment(
    {
      name: 'Makerverse',
      version: getDevSemver(),
    },
    { organization: 'makermadecnc', product: 'makerverse' },
  ),
  () => null,
);
