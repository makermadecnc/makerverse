import {ITool, ToolBase} from './types';
import * as React from 'react';

// Lives as its own function so that it might be statically generated or perhaps load remote tools (?)
export function useTool(tool: ITool): React.LazyExoticComponent<ToolBase> | undefined {
  const p = tool.componentPath;
  if (p === 'Console') return React.lazy(() => import('./Console'));
  if (p === 'Controls') return React.lazy(() => import('./Controls'));
  if (p === 'Plans') return React.lazy(() => import('./Plans'));
  if (p === 'Machine') return React.lazy(() => import('./Machine'));
  if (p === 'WorkspaceSettings') return React.lazy(() => import('./WorkspaceSettings'));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return React.lazy(() => require(`./${p}`));
}
