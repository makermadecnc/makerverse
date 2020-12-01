import React from 'react';
import {IPortCollection, SystemPortContext} from './SystemPortContext';

export function useSystemPorts(): IPortCollection {
  return React.useContext(SystemPortContext);
}
