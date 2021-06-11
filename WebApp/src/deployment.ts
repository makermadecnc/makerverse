import {packageDeployment} from '@openworkshop/maker-hub/deployments';
import packageJson from './package';

const deployment = packageDeployment(packageJson);

console.log('deployment', deployment);

export default deployment;
