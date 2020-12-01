import React from 'react';
import {PortStatusFragment} from '../api/graphql';

export type PortMap = { [key: string]: PortStatusFragment };

export interface IPortCollection {
  errors?: (Error | undefined)[];
  portMap: PortMap;
  sortedPortNames: string[];
}

export const SystemPortContext: React.Context<IPortCollection> = React.createContext<IPortCollection>({
  errors: [],
  portMap: {},
  sortedPortNames: [],
});
