import _ from 'lodash';
import colornames from 'colornames';

const INCH = 25.4;

class WorkspaceAxis {
    static empty = {
        min: 0,
        max: 0,
        precision: 3,
        accuracy: 0.001,
    };

    constructor(workspace, axis, record) {
        this._workspace = workspace;
        this._axis = axis;
        this._record = { ...WorkspaceAxis.empty, ...record };
    }

    // Convert a value on the axis to a string, rounding it to the appropriate precision.
    getAxisValueString(val, isImperial = null) {
        // Since inches are ~= 1 order of magnitude less precise than millimeters...
        const precision = this.precision + (this._checkImperialUnits(isImperial) ? 1 : 0);
        const str = Number(val || 0).toFixed(precision);
        return precision > 0 ? str : str.split('.')[0];
    }

    // When used without an argument, uses the workspace setting.
    _checkImperialUnits(isImperial = null) {
        return isImperial === null ? this.workspace.isImperialUnits : !!isImperial;
    }

    get workspace() {
        return this._workspace;
    }

    // x, y, z
    get key() {
        return this._axis;
    }

    get name() {
        return this.key.toUpperCase();
    }

    _getNumber(key) {
        return _.has(this._record, key) ? Number(this._record[key]) : 0;
    }

    // Limits: minimum value
    get min() {
        return Math.min(this._getNumber('min'), 0);
    }

    // Limits: maximum value
    get max() {
        return Math.max(this._getNumber('max'), 1);
    }

    // Center point between min & max
    get middle() {
        return (this.max + this.min) / 2;
    }

    // Range between min & max
    get range() {
        return Math.abs(this.max - this.min);
    }

    // The minimum value the machine can step on this axis.
    get accuracy() {
        return this._getNumber('accuracy');
    }

    // The number of digits for rounding on this axis.
    get precision() {
        // do NOT use _getNumber (prevent recursion).
        return Number(this._record.precision);
    }

    get hasLimits() {
        return this.range !== 0;
    }

    // How much mm to add to each axis around the edges?
    get pad() {
        return 50;
    }

    // Color for the axis when shown in the visualizer.
    get color() {
        return colornames('black');
        // const defs = { x: 'red', y: 'green', z: 'blue' };
        // return defs[this.key] || 'gray';
    }

    getAxisLength(imperialUnits = null) {
        const div = this._checkImperialUnits(imperialUnits) ? INCH : 1;
        return this.range / div;
    }

    // Iterate all cells in the axis, invoking the callback with the position, as well as boolean majorStep?
    // Guaranteed to use even steps, as well as contain a zero position.
    eachGridLine(callback, imperialUnits = null) {
        const isImperialUnits = this._checkImperialUnits(imperialUnits);
        const step = isImperialUnits ? INCH : 10;
        const majorStep = isImperialUnits ? (12) : 10;
        const numNegativeSteps = Math.ceil(-this.min / step);
        const numPositiveSteps = Math.ceil(this.max / step);
        for (let i = -numNegativeSteps; i <= numPositiveSteps; i += 1) {
            callback(i * step, (Math.abs(i) % majorStep) === 0);
        }
    }
}

export default WorkspaceAxis;
