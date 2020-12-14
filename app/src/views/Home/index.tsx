import React, { FunctionComponent } from 'react';
import {useOpenController} from '@openworkshop/ui/open-controller/Context';

const Home: FunctionComponent = () => {
  const makerverse = useOpenController();
  const hasWorkspaces = makerverse.workspaces.length > 0;

  return (
    <div>
      Home

    </div>
  );
};

export default Home;
