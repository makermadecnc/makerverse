import * as React from 'react';
import {GcodeVisualizerContext} from './GcodeVisualizerContext';
import {IVisualizeGCode, IVisualizerPreferences, ViewPlane} from './types';

type Props = {
 children: React.ReactNode;
};

const GcodeVisualizerProvider: React.FunctionComponent<Props> = (props) => {
  const [viewPlane, setViewPlane] = React.useState<ViewPlane>(ViewPlane.None);

  const preferences: IVisualizerPreferences = {
    viewPlane,
    setViewPlane,
  };

  const wiz: IVisualizeGCode = { preferences };

  return (
    <GcodeVisualizerContext.Provider value={wiz}  >
      {props.children}
    </GcodeVisualizerContext.Provider>
  );
};

export default GcodeVisualizerProvider;
