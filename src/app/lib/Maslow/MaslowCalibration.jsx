import log from 'app/lib/log';
import MaslowKinematics from './MaslowKinematics';

const calibrationDefaults = {
    safeTravel: 3,
    motorXAccuracy: 5,
    motorYAccuracy: 5,
    sledRadius: 228.6,
    edgeDistance: 25.4,
    origChainLength: 1790,
    measuredInches: false,
    cutDepth: 3,
    cutHoles: false,
};

/**
 * Implements "Edge Calibration" for Maslow, derivative of HoleyCalibration.
 */
class MaslowCalibration {
    opts = {};

    constructor(controller, opts) {
        this.controller = controller;
        this.kin = new MaslowKinematics(controller);
        this.update({ ...calibrationDefaults, ...(opts || {}) });
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
        if (measurements.length !== 10) {
            log.error('Calibration requires exactly 10 measurements');
            return false;
        }
        log.debug('calibrating...');
        const measured = this.calculateMeasurementCoordinates(measurements);

        const origSettings = {
            leftChainTolerance: this.kin.opts.leftChainTolerance,
            rightChainTolerance: this.kin.opts.rightChainTolerance,
            distBetweenMotors: this.kin.opts.distBetweenMotors,
            motorOffsetY: this.kin.opts.motorOffsetY,
        };
        const origErr = this.calculateError(measured, this.idealCoordinates);
        const orig = { ...origSettings, ...origErr };

        let op = orig;
        const decimals = 4;
        for (let i = 0; i < decimals; i++) {
            log.debug('calibration #', i);
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
            optimized: op
        };
    }

    optimize(measured, start, i, decimals, callback) {
        const precision = 1.0 / Math.pow(10, i);
        const percentMult = (i + 1) / decimals;
        const percentAdd = percentMult * i;
        const chainBounds = 5; // Math.pow(steps, 1/2) / 2;
        let mxBounds = Math.min(this.opts.motorXAccuracy, 1), myBounds = Math.min(this.opts.motorYAccuracy, 1);
        if (precision > 0.01) {
            mxBounds = this.opts.motorXAccuracy;
            myBounds = this.opts.motorYAccuracy;
        }
        const iters = (mxBounds * 2) * (myBounds * 2) * (chainBounds * 2) * (chainBounds * 2);
        const step = precision / chainBounds;
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
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    round(v, dec = 6) {
        const factor = Math.pow(10, dec);
        return Math.round(v * factor) / factor;
    }

    calculateMeasurementCoordinates(ms) {
        const mm = this.opts.measuredInches ? 25.4 : 1;
        const h = this.kin.opts.machineHeight;
        const w = this.kin.opts.machineWidth;
        const r = (this.opts.cutHoles ? 0 : this.opts.sledRadius);
        return [
            { x: (ms[8] * mm + r - w / 2), y: (h / 2 - ms[9] * mm - r) },
            { x: (0), y: (h / 2 - ms[0] * mm - r) },
            { x: (w / 2 - ms[2] * mm - r), y: (h / 2 - ms[1] * mm - r) },

            { x: (ms[7] * mm + r - w / 2), y: (ms[6] * mm + r - h / 2) },
            { x: (0), y: (ms[5] * mm + r - h / 2) },
            { x: (w / 2 - ms[3] * mm - r), y: (ms[4] * mm + r - h / 2) }
        ];
    }

    calculateIdealCoordinates() {
        const inset = (this.opts.cutHoles ? 0 : this.opts.sledRadius) + this.opts.edgeDistance;
        const aH1x = -(this.kin.opts.machineWidth / 2.0 - inset);
        const aH1y = (this.kin.opts.machineHeight / 2.0 - inset);
        const aH2x = 0;
        return [
            { x: aH1x, y: aH1y },
            { x: aH2x, y: aH1y },
            { x: -aH1x, y: aH1y },
            { x: aH1x, y: -aH1y },
            { x: aH2x, y: -aH1y },
            { x: -aH1x, y: -aH1y }
        ];
        // this.kin.recomputeGeometry();
    }

    calculateChainLengths(points) {
        const ret = [];
        for (let x = 0; x < points.length; x++) {
            const cl = this.kin.positionToChain(points[x].x, points[x].y);
            ret.push(cl);
        }
        return ret;
    }

    // Gcode to set the work position to the home position, aka, 0,0
    get setWposToMposCmd() {
        const mpos = this.controller.state.status.mpos;
        return `G10 L20 P1 X${mpos.x} Y${mpos.y}`;
    }

    generateGcodePoint(pointIndex, gcode = ['$X', 'G21', 'G90']) {
        const p = this.idealCoordinates[pointIndex];
        gcode.push(this.setWposToMposCmd);
        gcode.push(`G0 X${p.x} Y${p.y}`);
        if (this.opts.cutHoles) {
            gcode.push(`G0 Z-${this.opts.cutDepth}`);
            gcode.push(`G0 Z${this.opts.safeTravel}`);
        }
        return gcode;
    }

    generateGcode() {
        const ret = ['$X', 'G21', 'G90'];
        const cutOrder = [1, 2, 5, 4, 3, 0];
        for (let i = 0; i < cutOrder.length; i++) {
            this.generateGcodePoint(cutOrder[i], ret);
        }
        ret.push('G0 X0 Y0');
        return ret;
    }
}

export default MaslowCalibration;
