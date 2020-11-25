import React, { FunctionComponent } from 'react';
import {MakerverseContext} from '../../lib/Makerverse';

const Home: FunctionComponent = () => {
  const makerverse = React.useContext(MakerverseContext);
  const hasWorkspaces = makerverse.workspaces.length > 0;

  return (
    <div>
      Home

    </div>
  );
};

export default Home;
