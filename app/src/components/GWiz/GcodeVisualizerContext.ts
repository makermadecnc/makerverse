import {IVisualizeGCode, IVisualizerPreferences, ViewPlane} from './types';
import * as React from 'react';

export const preferences: IVisualizerPreferences = {
  viewPlane: 0,
  setViewPlane: (vp: ViewPlane) => {
    console.log('test', vp);
  }
};

export const GcodeVisualizerContext = React.createContext<IVisualizeGCode>({ preferences });
