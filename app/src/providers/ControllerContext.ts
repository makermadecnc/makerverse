import React from 'react';
import {
  ControlledMachineFragment
} from '../api/graphql';

export interface IController {
  machine: ControlledMachineFragment;
}

export interface IHaveController {
  controller: IController;
}

export interface IMaybeHaveController {
  controller?: IController;
}

const ControllerContext = React.createContext<IController | undefined>(undefined);
export default ControllerContext;
