import { AxisName, MachineAxis } from '@openworkshop/lib/api/graphql';
import { normalizeAxisName } from '@openworkshop/lib/api/Machines/AxisName';
import _ from 'lodash';
import Workspace from './workspace';

const INCH = 25.4;

interface IJogStepsOpts {
  imperialUnits?: boolean;
  min: number;
  max: number;
}

class WorkspaceAxis {
  static empty = {
    min: 0,
    max: 0,
    precision: 3,
    accuracy: 0.001,
  };

  _workspace: Workspace;
  _axis: AxisName;
  _record: MachineAxis;

  constructor(workspace: Workspace, axis: string, record: MachineAxis) {
    this._workspace = workspace;
    this._axis = normalizeAxisName(axis) || AxisName.X;
    this._record = { ...WorkspaceAxis.empty, ...record };
  }

  // Convert a value on the axis to a string, rounding it to the appropriate precision.
  getAxisValueString(val: string | number, isImperial?: boolean): string {
    // Since inches are ~= 1 order of magnitude less precise than millimeters...
    const precision = this.precision + (this._checkImperialUnits(isImperial) ? 1 : 0);
    const str = Number(val || 0).toFixed(precision);
    return precision > 0 ? str : str.split('.')[0];
  }

  round(val: string | number, isImperialUnits?: boolean): number {
    return Number(this.getAxisValueString(val, isImperialUnits));
  }

  // When used without an argument, uses the workspace setting.
  _checkImperialUnits(isImperial?: boolean): boolean {
    return isImperial === undefined ? this.workspace.isImperialUnits : isImperial;
  }

  get workspace(): Workspace {
    return this._workspace;
  }

  get key(): AxisName {
    return this._axis;
  }

  get name(): string {
    return this.key.toUpperCase();
  }

  _getNumber(key: 'min' | 'max' | 'precision' | 'accuracy'): number {
    return _.has(this._record, key) ? Number(this._record[key]) : 0;
  }

  // Limits: minimum value
  get min(): number {
    return Math.min(this._getNumber('min'), 0);
  }

  // Limits: maximum value
  get max(): number {
    return Math.max(this._getNumber('max'), 1);
  }

  // Center point between min & max
  get middle(): number {
    return (this.max + this.min) / 2;
  }

  // Range between min & max
  get range(): number {
    return Math.abs(this.max - this.min);
  }

  // Has this axis been configured correctly?
  get isValid(): boolean {
    return this.validRange && this.validAccuracy && this.validPrecision;
  }

  get validRange(): boolean {
    return this.max - this.min >= 10;
  }

  get validAccuracy(): boolean {
    return this.accuracy >= 0.0000001 && this.accuracy <= 1;
  }

  get validPrecision(): boolean {
    return this.precision >= 0 && !`${this.precision}`.includes('.');
  }

  // The minimum value the machine can step on this axis.
  get accuracy(): number {
    return this._getNumber('accuracy');
  }

  // The number of digits for rounding on this axis.
  get precision(): number {
    // do NOT use _getNumber (prevent recursion).
    return Number(this._record.precision);
  }

  get hasLimits(): boolean {
    return this.range !== 0;
  }

  // How much mm to add to each axis around the edges?
  get pad(): number {
    return 50;
  }

  // Color for the axis when shown in the visualizer.
  get color(): string {
    return '#000000';
    // const defs = { x: 'red', y: 'green', z: 'blue' };
    // return defs[this.key] || 'gray';
  }

  getAxisLength(imperialUnits?: boolean): number {
    const div = this._checkImperialUnits(imperialUnits) ? INCH : 1;
    return this.range / div;
  }

  // Iterate all cells in the axis, invoking the callback with the position, as well as boolean majorStep?
  // Guaranteed to use even steps, as well as contain a zero position.
  public eachGridLine(callback: (dist: number, isMajor: boolean) => void, imperialUnits?: boolean): void {
    const isImperialUnits = this._checkImperialUnits(imperialUnits);
    const step = isImperialUnits ? INCH : 10;
    const majorStep = isImperialUnits ? 12 : 10;
    const numNegativeSteps = Math.ceil(-this.min / step);
    const numPositiveSteps = Math.ceil(this.max / step);
    for (let i = -numNegativeSteps; i <= numPositiveSteps; i += 1) {
      callback(i * step, Math.abs(i) % majorStep === 0);
    }
  }

  // Returns an array of jog steps for this axis.
  public getJogSteps(opts: IJogStepsOpts): number[] {
    const isImperialUnits = this._checkImperialUnits(opts.imperialUnits);
    const max = opts.max || this.range / 2;
    const min = opts.min || this.accuracy;
    const steps = [];
    for (let v = min; v < max; v *= 10) {
      steps.push(this.round(v, isImperialUnits));
      const v2 = v * 10;
      if (v2 < max) {
        steps.push(this.round(v2 / 2, isImperialUnits));
      }
    }
    // Remove the last element and add it in-order with the second-biggest element.
    const last = steps.pop() || 0;
    const next = this.round(max / 2, isImperialUnits);
    steps.push(Math.min(last, next));
    steps.push(Math.max(last, next));

    steps.push(max);
    return steps;
  }
}

export default WorkspaceAxis;
