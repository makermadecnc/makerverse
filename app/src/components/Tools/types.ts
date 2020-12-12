import {IHaveWorkspace} from '../Workspaces';

export interface ITool {
  // Each tool is a single instantiation within a group.
  id: string;
  // Name to display (after localization)
  titleKey: string;
  // The tool can be loaded from a local path (eventually HTTP?)
  componentPath: string;
}

export interface IHaveTool {
  tool: ITool;
}

export interface IToolGroup {
  id: string,
  titleKey: string;
  icon: string;
  tools: ITool[];
}

export interface IHaveToolGroup {
  toolGroup: IToolGroup;
}

export interface IAmTool extends IHaveTool, IHaveWorkspace { }

// Concrete subclass for loading
export type ToolBase = React.FunctionComponent<IAmTool>;
