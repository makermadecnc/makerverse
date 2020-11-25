import React, { FunctionComponent } from 'react';

interface OwnProps {
  id: string;
}

type Props = OwnProps;

const index: FunctionComponent<Props> = (props) => {
  //const workspaces: Workspaces = useWorkspaces();
  //const workspace = workspaces.all[props.id];

  return (
    <div>
      {props.id}
    </div>
  );
};

export default index;
