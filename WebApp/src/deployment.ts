import {packageDeployment} from '@openworkshop/maker-hub/deployments';
import deploymentJson from './deployment.json';

console.log('[PACKAGE]', deploymentJson.package);
const deployment = packageDeployment(deploymentJson);

export default deployment;
