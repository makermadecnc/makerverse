import {
  IMakerHubDeploymentData,
  prepareDeployment,
} from '@openworkshop/maker-hub';
import deploymentJson from './deployment.json';
// import theme from '@openworkshop/maker-hub';
// import SupportTicketForm from './components/SupportTicketForm';

console.log('[PACKAGE]', deploymentJson.package);
const deployment = prepareDeployment(deploymentJson as IMakerHubDeploymentData);
// deployment.theme = theme;
// deployment.components = [
//   { name: 'SupportTicketForm', component: SupportTicketForm },
// ];
export default deployment;
