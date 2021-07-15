import {
  IMakerHubDeploymentData,
  prepareDeployment,
} from '@openworkshop/maker-hub/deployments';
import deploymentJson from './deployment.json';

console.log('[PACKAGE]', deploymentJson.package);
const deployment = prepareDeployment(deploymentJson as IMakerHubDeploymentData);

export default deployment;
