import React from 'react';
import ControllerContext, {IController} from './ControllerContext';

export function useController(): IController {
  const ret = React.useContext(ControllerContext);
  if (!ret) throw new Error('No controller');
  return ret;
}

export function tryUseController(): IController | undefined {
  return React.useContext(ControllerContext);
}
