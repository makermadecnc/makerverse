// import _ from 'lodash';
import log from 'js-logger';
import MaslowKinematics from './MaslowKinematics';

const calibrationDefaults = {
    safeTravel: 3,
    motorXAccuracy: 10,
    motorYAccuracy: 5,
    chainBounds: 5,
    edgeDistance: 0,
    cutEdgeDistance: 25.4,
    origChainLength: 1790,
    measuredInches: false,
    cutDepth: 3,
    cutHoles: false,
};

// const sleds = {
//     'Standard 18in Circle': { top: 9 * 25.4, left: 9 * 25.4, right: 9 * 25.4, bottom: 9 * 25.4, desc: '18 inch diameter circle' },
//     'MetalMaslow Square': { top: 6.325 * 25.4, left: 7.325 * 25.4, right: 7.325 * 25.4, bottom: 8.325 * 25.4, desc: '14.64 inch square, off-center' },
//     'Custom': { top: 9 * 25.4, left: 9 * 25.4, right: 9 * 25.4, bottom: 9 * 25.4, desc: 'Enter your own measurements' },
// };

// Hardcoded from server
const sleds = {
    'maslow-mm-square-sled': {
        'id': 'maslow-mm-square-sled',
        'partType': 'SLED',
        'title': 'Metal Maslow Square',
        'description': 'The MetalMaslow square sled, with the tip of the cutter slightly above center.',
        'dataBlob': '{\"top\":161.2875,\"right\":186.7875,\"bottom\":212.2875,\"left\":186.7875}',
        'settings': []
    },
    'maslow-round-18-sled': {
        'id': 'maslow-round-18-sled',
        'partType': 'SLED',
        'title': 'Standard 18-inch Circle',
        'description': 'An 18-inch diameter sled, with the tip of the cutter 9 inches from each edge (most common).',
        'dataBlob': '{\"top\":229.5,\"right\":229.5,\"bottom\":229.5,\"left\":229.5}',
        'settings': []
    }
};

const customSledDimensions = { top: 9 * 25.4, left: 9 * 25.4, right: 9 * 25.4, bottom: 9 * 25.4 };

const selectedSled = { id: '', data: { ...customSledDimensions } };

export {
    selectedSled,
    customSledDimensions,
    sleds
};

/**
 * Implements "Edge Calibration" for Maslow, derivative of HoleyCalibration.
 */
class MaslowCalibration {
    opts = {};

    // Accepts sled part object from server
    static setSledId(sledId) {
        selectedSled.id = sledId;
        if (!sledId || !sleds[sledId]) {
            // Custom sled.
            selectedSled.id = '';
            selectedSled.data = customSledDimensions;
            return selectedSled;
        }
        try {
            selectedSled.data = JSON.parse(sleds[sledId].dataBlob);
        } catch (e) {
            log.error(e, 'sled selection');
        }
        return selectedSled;
    }

    static setCustomSledDimension(edge, value) {
        customSledDimensions[edge] = value;
        if (selectedSled.id.length <= 0) {
            selectedSled.data = { ...customSledDimensions };
        }
    }

    constructor(controller, opts) {
        this.controller = controller;
        this.kin = new MaslowKinematics(controller);
        this.update({ ...calibrationDefaults, ...(opts || {}) });
    }

    loadControllerSettings(controllerSettings) {
        this.kin.loadControllerSettings(controllerSettings);
    }

    update(opts) {
        this.opts = { ...this.opts, ...opts };
        this.recomputeIdeals();
    }

    recomputeIdeals() {
        this.idealCoordinates = this.calculateIdealCoordinates();
        this.idealChainLengths = this.calculateChainLengths(this.idealCoordinates);
    }

    calibrate(measurements, callback) {
        log.debug('calibrating...');
        this.recomputeIdeals();
        const measured = this.calculateMeasurementCoordinates(measurements);
        const xError = this.calculateXError(measured, this.idealCoordinates);
        const yError = this.calculateYError(measured, this.idealCoordinates);
        const ret = this._calibrate(measured, yError, callback);
        ret.xError = xError;
        ret.skew = this.calculateSkew(measured);
        return ret;
    }

    _calibrate(measured, yError, callback) {
        const origSettings = {
            leftChainTolerance: this.kin.opts.leftChainTolerance || 0,
            rightChainTolerance: this.kin.opts.rightChainTolerance || 0,
            distBetweenMotors: this.kin.opts.distBetweenMotors,
            motorOffsetY: this.kin.opts.motorOffsetY,
        };
        const origErr = this.calculateError(measured, this.idealCoordinates);
        const orig = { ...origSettings, ...origErr };
        log.debug('calibration begin', origSettings, origErr, orig);

        let op = { ...orig };
        // Start by offsetting the motor offset by the y error, so it's a reasonable guess.
        op.motorOffsetY -= yError ? Math.round(yError) : 0;
        const decimals = 4;
        for (let i = 0; i < decimals; i++) {
            log.debug('calibration #', i, op);
            op = this.optimize(measured, op, i, decimals, callback);
        }

        const change = this.calculateChange(orig, op);

        return {
            orig: orig,
            change: change,
            improvementPercent: {
                avgErrDist: this.round(-change.avgErrDist / orig.avgErrDist * 100, 2),
                maxErrDist: this.round(-change.maxErrDist / orig.maxErrDist * 100, 2),
            },
            optimized: op,
        };
    }

    // First pass calibration. After setting chains, user is told to move the sled to origin.
    // X/Y offset point is passed in.
    calibrateOrigin(homePoint, offsetFromOrigin) {
        const chainBounds = this.opts.chainBounds;
        const measured = [homePoint, offsetFromOrigin];
        this.idealCoordinates = [homePoint, { x: 0, y: 0 }];
        this.idealChainLengths = this.calculateChainLengths(this.idealCoordinates);
        this.opts.chainBounds = 0;
        log.debug('Calibrate origin', this.opts, this.kin.opts);
        const ret = this._calibrate(measured);
        this.opts.chainBounds = chainBounds;
        this.recomputeIdeals();
        return ret;
    }

    calculateSkew(measured) {
        const tr = measured[1];
        const br = measured[2];
        const bl = measured[4];
        const tl = measured[5];
        const skewRight = tr.x - br.x;
        const skewLeft = tl.x - bl.x;
        if (Math.abs(skewRight) < 1 || Math.abs(skewLeft) < 1) {
            return 0;
        }
        const lneg = skewLeft < 0;
        const rneg = skewRight < 0;
        if (lneg !== rneg) {
            // Both must be skewed in the same direction.
            return 0;
        }
        if (Math.abs(skewRight) > Math.abs(skewLeft)) {
            return Math.round(skewRight);
        } else {
            return Math.round(skewLeft);
        }
    }

    // Y error is the average of all Y errors, thus shifting the entire cutting plane up/down
    // to match the appropriate center-point.
    calculateYError(measured, ideal) {
        let total = 0;
        for (let i = 0; i < measured.length; i++) {
            total += ideal[i].y - measured[i].y;
        }
        return total / measured.length;
    }

    calculateXError(measured, ideals) {
        let posCount = 0;
        let negCount = 0;
        let posMin = 9999;
        let negMin = 9999;
        const pts = [1, 2, 4, 5];
        pts.forEach((i) => {
            const xOff = ideals[i].x - measured[i].x;
            if (xOff < 0) {
                negCount++;
                negMin = Math.min(negMin, Math.abs(xOff));
            }
            if (xOff > 0) {
                posCount++;
                posMin = Math.min(posMin, Math.abs(xOff));
            }
        });
        if (posCount === pts.length) {
            return posMin;
        }
        if (negCount === pts.length) {
            return -negMin;
        }
        return 0;
    }

    optimize(measured, start, i, decimals, callback) {
        const precision = 1.0 / Math.pow(10, i);
        const percentMult = (i + 1) / decimals;
        const percentAdd = percentMult * i;
        const chainBounds = this.opts.chainBounds;
        let mxBounds = Math.min(this.opts.motorXAccuracy, 1);
        let myBounds = Math.min(this.opts.motorYAccuracy, 1);
        if (precision > 0.01) {
            mxBounds = this.opts.motorXAccuracy;
            myBounds = this.opts.motorYAccuracy;
        }
        const iters = (mxBounds * 2) * (myBounds * 2) * (chainBounds * 2) * (chainBounds * 2);
        const step = chainBounds > 0 ? (precision / chainBounds) : 0;
        let idx = 0;
        let best = { ...start };

        for (let mw = -mxBounds; mw <= mxBounds; mw++) {
            for (let mh = -myBounds; mh <= myBounds; mh++) {
                for (let left = -chainBounds; left <= chainBounds; left++) {
                    for (let right = -chainBounds; right <= chainBounds; right++) {
                        const opt = this.calculateOptimization(
                            measured,
                            start.leftChainTolerance + left * step,
                            start.rightChainTolerance + right * step,
                            start.motorOffsetY + mh,
                            start.distBetweenMotors + mw
                        );
                        if (opt.maxErrDist < best.maxErrDist && opt.totalErrDist <= best.totalErrDist) {
                            log.debug('new best', opt, 'change=', this.calculateChange(best, opt));
                            best = opt;
                        }
                        idx++;
                    }
                }
                const percent = Math.round(((idx / iters) * percentMult + percentAdd) * 100);
                if (callback) {
                    callback(percent);
                }
            }
        }
        return best;
    }

    calculateChange(orig, op) {
        const change = {};
        Object.keys(orig).forEach((k) => {
            change[k] = this.round(op[k] - orig[k]);
        });
        return change;
    }

    calculateOptimization(measured, leftChainTolerance, rightChainTolerance, motorOffsetY, distBetweenMotors) {
        const opt = {
            leftChainTolerance: this.round(leftChainTolerance),
            rightChainTolerance: this.round(rightChainTolerance),
            distBetweenMotors: this.round(distBetweenMotors),
            motorOffsetY: this.round(motorOffsetY),
        };
        this.kin.recomputeGeometry(opt);
        const points = [];
        for (let x = 0; x < this.idealChainLengths.length; x++) {
            const cl = this.idealChainLengths[x];
            const p = this.kin.chainToPosition(cl[0], cl[1], measured[x].x, measured[x].y);
            if (!p) {
                // Position would not be within bounds. Ignore the possibility.
                log.warn('Failed to compute location', measured, leftChainTolerance,
                    rightChainTolerance, motorOffsetY, distBetweenMotors, this.idealChainLengths);
                return false;
            }
            points.push(p);
        }
        return { ...opt, ...this.calculateError(measured, points) };
    }

    calculateError(measured, points) {
        const opt = {
            totalErrDist: 0,
            maxErrDist: 0,
        };
        for (let i = 0; i < measured.length; i++) {
            const d = this.dist(measured[i], points[i]);
            opt.totalErrDist += d;
            opt.maxErrDist = Math.max(opt.maxErrDist, this.round(d));
        }
        opt.totalErrDist = this.round(opt.totalErrDist);
        opt.avgErrDist = this.round(opt.totalErrDist / measured.length);
        return opt;
    }

    dist(p1, p2) {
        const x = Number(p1.x) - Number(p2.x);
        const y = Number(p1.y) - Number(p2.y);
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    round(v, dec = 6) {
        const factor = Math.pow(10, dec);
        return Math.round(v * factor) / factor;
    }

    get sledDimensions() {
        const ret = selectedSled.data;
        ['top', 'right', 'bottom', 'left'].forEach((k) => {
            ret[k] = ret[k] || 0;
        });
        return ret;
    }

    get effectiveSledDimensions() {
        return this.opts.cutHoles ? { top: 0, left: 0, bottom: 0, right: 0 } : this.sledDimensions;
    }

    calculateMeasurementCoordinates(ms) {
        const mm = this.opts.measuredInches ? 25.4 : 1;
        const h = this.kin.opts.machineHeight;
        const w = this.kin.opts.machineWidth;
        const s = this.effectiveSledDimensions;
        return [
            { x: (0), y: (h / 2 - ms[0] * mm - s.top) },
            { x: (w / 2 - ms[2] * mm - s.right), y: (h / 2 - ms[1] * mm - s.top) },
            { x: (w / 2 - ms[3] * mm - s.right), y: (ms[4] * mm + s.bottom - h / 2) },
            { x: (0), y: (ms[5] * mm + s.bottom - h / 2) },
            { x: (ms[7] * mm + s.left - w / 2), y: (ms[6] * mm + s.bottom - h / 2) },
            { x: (ms[8] * mm + s.left - w / 2), y: (h / 2 - ms[9] * mm - s.top) },
        ];
    }

    calculateIdealCoordinates() {
        const ed = this.opts.cutHoles ? this.opts.cutEdgeDistance : this.opts.edgeDistance;
        const s = this.effectiveSledDimensions;
        const aH1x = (this.kin.opts.machineWidth / 2.0 - ed);
        const aH1y = (this.kin.opts.machineHeight / 2.0 - ed);
        return [
            { x: 0, y: aH1y - s.top },
            { x: aH1x - s.right, y: aH1y - s.top },
            { x: aH1x - s.right, y: -aH1y + s.bottom },
            { x: 0, y: -aH1y + s.bottom },
            { x: -aH1x + s.left, y: -aH1y + s.bottom },
            { x: -aH1x + s.left, y: aH1y - s.top },
        ];
    }

    calculateChainLengths(points) {
        const ret = [];
        for (let x = 0; x < points.length; x++) {
            const cl = this.kin.positionToChain(points[x].x, points[x].y);
            ret.push(cl);
        }
        return ret;
    }

    generateGcodePoint(p, gcode = ['G21', 'G90']) {
        const mpos = this.controller.state.status.mpos;
        const wpos = this.controller.state.status.wpos;
        if (this.dist(mpos, wpos) >= 0.1) {
            // Set WPos = MPos when they differ.
            gcode.push(`G10 L20 P1 X${mpos.x} Y${mpos.y} Z${mpos.z}`);
        }
        if (this.opts.cutHoles) {
            gcode.push(`G0 Z${this.opts.safeTravel}`);
        }
        const pX = Math.round(p.x * 10) / 10;
        const pY = Math.round(p.y * 10) / 10;
        gcode.push(`G0 X${pX} Y${pY}`);
        if (this.opts.cutHoles) {
            gcode.push(`G0 Z-${this.opts.cutDepth}`);
            gcode.push(`G0 Z${this.opts.safeTravel}`);
        }
        if (this.opts.measuredInches) {
            gcode.push('G20');
        }
        return gcode;
    }

    generateCalibrationGcode(pointIndex, gcode = ['G21', 'G90']) {
        return this.generateGcodePoint(this.idealCoordinates[pointIndex], gcode);
    }

    generateGoToCenterGcode() {
        const cutHoles = this.opts.cutHoles;
        this.opts.cutHoles = false;
        const ret = this.generateGcodePoint({ x: 0, y: 0 });
        this.opts.cutHoles = cutHoles;
        return ret;
    }
}

export default MaslowCalibration;
