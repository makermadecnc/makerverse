import _ from 'lodash';

class Limits {
    static empty = {
        xmin: 0,
        xmax: 0,
        ymin: 0,
        ymax: 0,
        zmin: 0,
        zmax: 0
    };

    constructor(record) {
        this._record = record;
    }

    getNumber(key) {
        if (!_.has(this._record, key)) {
            return 0;
        }
        return Math.round(Number(this._record[key]) * 100) / 100;
    }

    get xmin() {
        return this.getNumber('xmin');
    }

    get xmax() {
        return this.getNumber('xmax');
    }

    get xrange() {
        return Math.abs(this.xmax - this.xmin);
    }

    get ymin() {
        return this.getNumber('ymin');
    }

    get ymax() {
        return this.getNumber('ymax');
    }

    get yrange() {
        return Math.abs(this.ymax - this.ymin);
    }

    get zmin() {
        return this.getNumber('zmin');
    }

    get zmax() {
        return this.getNumber('zmax');
    }

    get zrange() {
        return Math.abs(this.zmax - this.zmin);
    }

    get isValid() {
        return this.xrange !== 0 || this.yrange !== 0 || this.zrange !== 0;
    }
}

export default Limits;
