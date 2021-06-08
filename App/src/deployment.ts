import { getDevSemver, packageDeployment } from '@openworkshop/maker-hub/deployments';

const deployment = packageDeployment({
  name: '[DEV] Makerverse',
  version: getDevSemver(),
  pathPrefix: '/make',
});

export default deployment;
