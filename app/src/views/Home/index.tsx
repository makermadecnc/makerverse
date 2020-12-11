import React, { FunctionComponent } from 'react';
import {useMakerverse} from '../../providers';

const Home: FunctionComponent = () => {
  const makerverse = useMakerverse();
  const hasWorkspaces = makerverse.workspaces.length > 0;

  return (
    <div>
      Home

    </div>
  );
};

export default Home;
