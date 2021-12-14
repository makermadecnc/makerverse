import {
  IMakerHubDeploymentData,
  prepareDeployment,
} from '@openworkshop/maker-hub/deployments';
import deploymentJson from './deployment.json';
import theme from '@openworkshop/maker-hub/themes/MakerverseTheme';

console.log('[PACKAGE]', deploymentJson.package);
const deployment = prepareDeployment(deploymentJson as IMakerHubDeploymentData);
deployment.theme = theme;

export default deployment;
