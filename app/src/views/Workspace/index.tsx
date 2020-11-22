import React, { FunctionComponent } from 'react';
import {useWorkspaces, Workspaces} from '../../lib/Makerverse';

interface OwnProps {
  id: string;
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
  const workspaces: Workspaces = useWorkspaces();
  const workspace = workspaces.all[props.id];

  return (
    <div>
      {workspace.name}
    </div>
  );
};

export default index;
