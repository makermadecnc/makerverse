import { IOpenControllerPackage } from '@openworkshop/ui/open-controller';
import { parseSemver } from '@openworkshop/ui/utils/semvers';
import devDeployment from '@openworkshop/ui/deployment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../package.json');

const makerverseDeployment: IOpenControllerPackage = {
  name: pkg.name,

  productName: pkg.productName,

  description: pkg.description,

  homepage: pkg.homepage,

  version: parseSemver(pkg.version),

  trackingId: devDeployment.trackingId,

  client: devDeployment.client,
};

export default makerverseDeployment;
