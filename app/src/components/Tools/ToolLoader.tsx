import * as React from 'react';
import {IHaveTool} from './types';
import {IHaveWorkspace} from '../Workspaces';
import {useTool} from './Hooks';

type Props = IHaveTool & IHaveWorkspace;

const ToolLoader: React.FunctionComponent<Props> = (props) => {
  const { tool, workspace } = props;
  const Tool = useTool(tool);

  if (!Tool) return <span>Missing: {tool.componentPath}</span>;

  return <Tool tool={tool} workspace={workspace} />;
};

export default ToolLoader;
