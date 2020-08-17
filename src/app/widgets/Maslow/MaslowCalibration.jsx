class Kinematics {
        constructor(opts) {
            this.opts = { ...opts };
        this.sprocketRadius = 10.1;
        this.maxGuess = 200;
        this.maxErr = 0.1;
        this.lastPosition = {x: 0, y: 0};
        this.recomputeGeometry();
    }

    chainToPosition(chainALength, chainBLength, xGuess, yGuess) {
            xGuess = xGuess || this.lastPosition.x;
        yGuess = yGuess || this.lastPosition.y;
            const p = this.triangularForward(chainALength, chainBLength, xGuess, yGuess);
        if (p) {
                this.lastPosition = p;
        }
        return p;
    }

    positionToChain(xTarget, yTarget) {
            return this.triangularInverse(xTarget, yTarget);
    }

    recomputeGeometry(opts) {
            opts = opts || {};
            this.opts = { ...this.opts, ...opts };
        this.xCordOfMotor = this.opts.distBetweenMotors / 2;
        this.yCordOfMotor = (this.opts.machineHeight / 2) + this.opts.motorOffsetY;
    }

    triangularForward(chainALength, chainBLength, xGuess, yGuess) {
        for(var guessCount = 0; guessCount < this.maxGuess; guessCount++){
            //check our guess
            const iv = this.triangularInverse(xGuess, yGuess);

            const aChainError = chainALength - iv[0];
            const bChainError = chainBLength - iv[1];

            //adjust the guess based on the result
            xGuess = xGuess + aChainError - bChainError;
            yGuess = yGuess - aChainError - bChainError;

                        if (iv[0] > this.opts.chainLength || iv[1] > this.opts.chainLength) {
                    continue;
            }

            //if we've converged on the point...or it's time to give up, exit the loop
            if ((Math.abs(aChainError) <= this.maxErr && Math.abs(bChainError) <= this.maxErr)) {
                return {x: xGuess, y: yGuess};
            }
        }
        return false;
    }

    triangularInverse(xTarget, yTarget) {
        // scale target (absolute position) by any correction factor
        // Use const math internally for faster computation.
        const xxx = xTarget; // * this.opts.XcorrScaling;
        const yyy = yTarget; // * this.opts.YcorrScaling;

        //Calculate motor axes length to the bit
        const Motor1Distance = Math.sqrt(Math.pow((-1*this.xCordOfMotor) - (xxx),2)+Math.pow((this.yCordOfMotor) - (yyy),2));
        const Motor2Distance = Math.sqrt(Math.pow(   (this.xCordOfMotor) - (xxx),2)+Math.pow((this.yCordOfMotor) - (yyy),2));

        //Set up variables
        var Chain1Angle = 0, Chain2Angle = 0;
        var Chain1AroundSprocket = 0, Chain2AroundSprocket = 0;
        var xTangent1 = 0, yTangent1 = 0, xTangent2 = 0, yTangent2 = 0;

        //Calculate the chain angles from horizontal, based on if the chain connects to the sled from the top or bottom of the sprocket
        const yDiff = this.yCordOfMotor - yTarget;
        if(this.opts.chainOverSprocket == 1){
          Chain1Angle = Math.asin(yDiff/Motor1Distance) + Math.asin(this.sprocketRadius/Motor1Distance);
          Chain2Angle = Math.asin(yDiff/Motor2Distance) + Math.asin(this.sprocketRadius/Motor2Distance);

          Chain1AroundSprocket = this.sprocketRadius * Chain1Angle;
          Chain2AroundSprocket = this.sprocketRadius * Chain2Angle;

          xTangent1 = -1.0 * this.xCordOfMotor + this.sprocketRadius * Math.sin(Chain1Angle);
          yTangent1 = this.yCordOfMotor + this.sprocketRadius * Math.cos(Chain1Angle);

          xTangent2 = this.xCordOfMotor - this.sprocketRadius * Math.sin(Chain2Angle);
          yTangent2 = this.yCordOfMotor + this.sprocketRadius * Math.cos(Chain2Angle);
        } else {
          Chain1Angle = Math.asin(yDiff/Motor1Distance) - Math.asin(this.sprocketRadius/Motor1Distance);
          Chain2Angle = Math.asin(yDiff/Motor2Distance) - Math.asin(this.sprocketRadius/Motor2Distance);

          Chain1AroundSprocket = this.sprocketRadius * (3.14159 - Chain1Angle);
          Chain2AroundSprocket = this.sprocketRadius * (3.14159 - Chain2Angle);

          xTangent1 = -1.0 * this.xCordOfMotor - this.sprocketRadius * Math.sin(Chain1Angle);
          yTangent1 = this.yCordOfMotor - this.sprocketRadius * Math.cos(Chain1Angle);

          xTangent2 = this.xCordOfMotor + this.sprocketRadius * Math.sin(Chain2Angle);
          yTangent2 = this.yCordOfMotor - this.sprocketRadius * Math.cos(Chain2Angle);
        }

        const sledWeight = this.opts.sledWeight;
        const chainDensity = 0.14 * 9.8 / 1000; // Newtons / mm
        const chainElasticity = this.opts.chainElongationFactor; // mm/mm/Newton

        //Calculate the straight chain length from the sprocket to the bit
        const srsqrd = Math.pow(this.sprocketRadius,2);
        const Chain1Straight = Math.sqrt(Math.pow(Motor1Distance,2)-srsqrd);
        const Chain2Straight = Math.sqrt(Math.pow(Motor2Distance,2)-srsqrd);

        // Calculate chain tension
        const totalWeight = sledWeight + 0.5 * chainDensity * (Chain1Straight + Chain2Straight);
        const tensionD = (xTangent1*yTangent2-xTangent2*yTangent1-xTangent1*yTarget+xTarget*yTangent1+xTangent2*yTarget-xTarget*yTangent2);
        const tension1 = - (totalWeight*Math.sqrt(Math.pow(xTangent1-xTarget,2.0)+Math.pow(yTangent1-yTarget,2.0))*(xTangent2-xTarget))/tensionD;
        const tension2 = (totalWeight*Math.sqrt(Math.pow(xTangent2-xTarget,2.0)+Math.pow(yTangent2-yTarget,2.0))*(xTangent1-xTarget))/tensionD;
        const horizontalTension = tension1 * (xTarget - xTangent1) / Chain1Straight;
        const a1 = horizontalTension / chainDensity;
        const a2 = horizontalTension / chainDensity;

        // Catenary equation: total chain length excluding sprocket geometry, chain tolerance, and chain elasticity
        var chain1 = Math.sqrt(Math.pow(2*a1*Math.sinh((xTarget-xTangent1)/(2*a1)),2)+Math.pow(yTangent1-yTarget,2));
        var chain2 = Math.sqrt(Math.pow(2*a2*Math.sinh((xTangent2-xTarget)/(2*a2)),2)+Math.pow(yTangent2-yTarget,2));

        //Calculate total chain lengths accounting for sprocket geometry, chain tolerance, and chain elasticity
        chain1 = Chain1AroundSprocket + chain1/(1.0+this.opts.leftChainTolerance/100.0)/(1.0+tension1*chainElasticity);
        chain2 = Chain2AroundSprocket + chain2/(1.0+this.opts.rightChainTolerance/100.0)/(1.0+tension2*chainElasticity);

        //Subtract of the virtual length which is added to the chain by the rotation mechanism
        return [chain1 - this.opts.rotationDiskRadius, chain2 - this.opts.rotationDiskRadius];
    }
}

class MaslowCalibration {
    constructor(opts) {
            this.opts = { ...opts };
        this.kin = new Kinematics(opts);
        this.idealCoordinates = this.calculateIdealCoordinates();
        this.idealChainLengths = this.calculateChainLengths(this.idealCoordinates);
    }

    calibrate(measurements) {
            if (measurements.length != 10) {
                return false;
        }
        const measured = this.calculateMeasurementCoordinates(measurements);
        // console.log('ideals', this.idealCoordinates, this.idealChainLengths);

        const orig = { ...{
                leftChainTolerance: this.opts.leftChainTolerance,
                rightChainTolerance: this.opts.leftChainTolerance,
        }, ...this.calculateError(measured, this.idealCoordinates) };
        if (!orig) {
                throw "The measured points could not be converted";
        }
        // console.log('orig', orig);
                var op = orig;
        const decimals = 4;
        for (var i=0; i<decimals; i++) {
                op = this.optimize(measured, op, 1000, 1.0 / Math.pow(10, i));
        }

        return {
              coordinates: {
                ideal: this.idealCoordinates,
                measured: measured,
            },
            improvement: {
                    avgErrDist: this.round((orig.avgErrDist - op.avgErrDist) / orig.avgErrDist * 100) + '%',
                    maxErrDist: this.round((orig.maxErrDist - op.maxErrDist) / orig.maxErrDist * 100) + '%',
            },
            optimized: op
        };
    }

    optimize(measured, start, steps, range) {
        const stepBound = Math.sqrt(steps) / 2;
        const perStep = range / stepBound;
        const motorSteps = 10;
        var best = { ...start };

        for (var mh = -motorSteps/2; mh<motorSteps/2; mh++) {
            for (var left=-stepBound; left<stepBound; left++) {
                for(var right=-stepBound; right<stepBound; right++) {
                    const lct = start.leftChainTolerance + left * perStep;
                    const rct = start.rightChainTolerance + right * perStep;
                    const opt = this.calculateOptimization(measured, lct, rct);
                    if (opt.totalErrDist < best.totalErrDist && opt.maxErrDist <= best.maxErrDist) {
                        console.log('new best', opt);
                        best = opt;
                    }
                }
            }
        }
        return best;
    }

    calculateOptimization(measured, leftChainTolerance, rightChainTolerance) {
        const opt = {
            leftChainTolerance: this.round(leftChainTolerance),
            rightChainTolerance: this.round(rightChainTolerance),
        };
        this.kin.recomputeGeometry(opt);
        const points = [];
        for (var x=0; x<this.idealChainLengths.length; x++) {
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
        for (var i=0; i<6; i++) {
            const d = this.dist(measured[i], points[i]);
            opt.totalErrDist += d;
            opt.maxErrDist = Math.max(opt.maxErrDist, this.round(d));
        }
        opt.totalErrDist = this.round(opt.totalErrDist);
        opt.avgErrDist = this.round(opt.totalErrDist / 6);
        return opt;
    }

    dist(p1, p2) {
            return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    round(v, dec=6) {
            const factor = Math.pow(10, dec);
            return Math.round(v * factor) / factor;
    }

    calculateMeasurementCoordinates(ms) {
        const mm = this.opts.measuredInches ? 25.4 : 1;
        const h = this.opts.machineHeight;
        const w = this.opts.machineWidth;
        const r = this.opts.sledRadius;
        return [
            {x: (ms[8]*mm+r-w/2), y: (h/2-ms[9]*mm-r)},
            {x: (0), y: (h/2-ms[0]*mm-r)},
            {x: (w/2-ms[2]*mm-r), y: (h/2-ms[1]*mm-r)},

            {x: (ms[7]*mm+r-w/2), y: (ms[6]*mm+r-h/2)},
            {x: (0), y: (ms[5]*mm+r-h/2)},
            {x: (w/2-ms[3]*mm-r), y: (ms[4]*mm+r-h/2)}
        ];
    }

    calculateIdealCoordinates() {
            const inset = this.opts.sledRadius + this.opts.edgeDistance;
        const aH1x = -(this.kin.opts.machineWidth / 2.0 - inset);
        const aH1y = (this.kin.opts.machineHeight / 2.0 - inset);
        const aH2x = 0;
        return [
            {x: aH1x, y: aH1y},
            {x: aH2x, y: aH1y},
            {x: -aH1x, y: aH1y},
            {x: aH1x, y: -aH1y},
            {x: aH2x, y: -aH1y},
            {x: -aH1x, y: -aH1y}
        ];
        // this.kin.recomputeGeometry();
    }

    calculateChainLengths(points) {
            const ret = [];
        for (var x=0; x<points.length; x++) {
                const cl = this.kin.positionToChain(points[x].x, points[x].y);
            if (isNaN(cl[0]) || isNaN(cl[1])) {
                    throw "Failed to calculate chain lengths (NaN)";
            }
                ret.push(cl);
        }
        return ret;
    }
}

const opts = {
        chainLength: 3360,
    distBetweenMotors: 2978.4,
    motorOffsetY: 463,
    rotationRadius: 139.1,
    leftChainTolerance: 0,
    rightChainTolerance: 0,
    sledWeight: 97.9,
    chainOverSprocket: false,
    rotationDiskRadius: 104.3,
    chainElongationFactor: 8.1E-6,
    machineHeight: 1219.2,
    machineWidth: 2438.4,
    sledRadius: 228.6,
    edgeDistance: 25.4,
    measuredInches: false,
}

opts.distBetweenMotors = 2953;
opts.motorOffsetY = 475;
opts.sledWeight = 115;
opts.measuredInches = false;
opts.leftChainTolerance = -0.00051300;
opts.rightChainTolerance = 0.00075200;
opts.sledRadius = 0;
const measurements = [27,24,26,23,20,22,23,28,23,18];

c = new MaslowCalibration(opts);
ret = c.calibrate(measurements);
console.log(ret);