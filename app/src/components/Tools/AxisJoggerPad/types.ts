
export type MovementType = 'absolute' | 'relative';

export interface IMoveRequest {
  type?: MovementType; // default: relative
  xAxis?: number;
  yAxis?: number;
  zAxis?: number;
}
