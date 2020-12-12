export enum ViewMode {
  Perspective,
  Plane,
  Layers,
}

export enum ViewPlane {
  None, // aka, 3d
  Top,
  Bottom,
  Left,
  Right,
  Front,
  Back,
  NumPlanes,
}

export interface IVisualizerPreferences {
  viewPlane: ViewPlane;
  setViewPlane: (vm: ViewPlane) => void;
}

export interface IVisualizeGCode {
  preferences: IVisualizerPreferences;
}

export interface IHaveGWiz {
  wiz: IVisualizeGCode;
}

export interface IMaybeHaveGWiz {
  wiz?: IVisualizeGCode;
}
