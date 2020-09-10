import _ from 'lodash';

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
        if (isImperial === null) {
            isImperial = this._workspace.isImperialUnits;
        }
        // Since inches are ~= 1 order of magnitude less precise than millimeters...
        const precision = this.precision + (isImperial ? 1 : 0);
        const str = Number(val || 0).toFixed(precision);
        return precision > 0 ? str : str.split('.')[0];
    }

    // x, y, z
    get key() {
        return this._axis;
    }

    _getNumber(key) {
        return _.has(this._record, key) ? Number(this._record[key]) : 0;
    }

    // Limits: minimum value
    get min() {
        return this._getNumber('min');
    }

    // Limits: maximum value
    get max() {
        return this._getNumber('max');
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
}

export default WorkspaceAxis;
