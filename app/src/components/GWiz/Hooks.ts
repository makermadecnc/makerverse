import React from 'react';
import { GcodeVisualizerContext } from './GcodeVisualizerContext';
import {IVisualizeGCode} from './types';

export function useGcodeVisualizer(): IVisualizeGCode {
  const context = React.useContext(GcodeVisualizerContext);
  if (!context) throw new Error('No gcode visualizer');
  return context;
}

export function tryUseGcodeVisualizer(): IVisualizeGCode | undefined {
  return React.useContext(GcodeVisualizerContext);
}
