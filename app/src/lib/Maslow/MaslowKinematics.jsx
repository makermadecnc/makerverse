import { MASLOW } from 'constants/index';
import MachineSettings from '../MachineSettings';

const maslowDefaultOpts = {
    chainLength: 3360,
    distBetweenMotors: 2978.4,
    motorOffsetY: 463,
    leftChainTolerance: 0,
    rightChainTolerance: 0,
    sledWeight: 97.9,
    chainOverSprocket: 2, // 2==bottom, 1==top (requires weights)
    rotationDiskRadius: 139.1,
    chainElongationFactor: 5.1685e-6,
    machineHeight: 1219.2,
    machineWidth: 2438.4,
};

/**
 * Port of Kinematics.cpp from the original Maslow Holey firmware.
 */
class MaslowKinematics {
    sprocketRadius = 10.1;

    maxGuess = 200;

    maxErr = 0.01;

    lastPosition = { x: 0, y: 0 };

    lastChains = [0, 0];

    opts = maslowDefaultOpts;

    settings = new MachineSettings(null, MASLOW);

    constructor(controller) {
        this.controller = controller;
        this.loadControllerSettings(controller.settings);
    }

    reloadFromSettings() {
        const opts = {};
        Object.keys(this.settings.map).forEach((key) => {
            opts[key] = Number(this.settings.map[key].value);
        });
        this.recomputeGeometry(opts);
        this.positionToChain(this.lastPosition.x, this.lastPosition.y); // save chain lengths
    }

    export() {
        return this.settings.export(Object.keys(maslowDefaultOpts));
    }

    loadControllerSettings(controllerSettings) {
        this.controllerSettings = controllerSettings;
        this.settings.update(controllerSettings);
        this.reloadFromSettings();
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
        const c = this.triangularInverse(xTarget, yTarget);
        if (c) {
            this.lastChains = c;
        }
        return c;
    }

    recomputeGeometry(opts) {
        opts = opts || {};
        this.opts = { ...this.opts, ...opts };
        this.xCordOfMotor = this.opts.distBetweenMotors / 2;
        this.yCordOfMotor = (this.opts.machineHeight / 2) + this.opts.motorOffsetY;
    }

    triangularForward(chainALength, chainBLength, xGuess, yGuess) {
        for (let guessCount = 0; guessCount < this.maxGuess; guessCount++) {
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
                return { x: xGuess, y: yGuess };
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
        const Motor1Distance = Math.sqrt(Math.pow((-1 * this.xCordOfMotor) - (xxx), 2) + Math.pow((this.yCordOfMotor) - (yyy), 2));
        const Motor2Distance = Math.sqrt(Math.pow((this.xCordOfMotor) - (xxx), 2) + Math.pow((this.yCordOfMotor) - (yyy), 2));

        //Set up variables
        let Chain1Angle = 0, Chain2Angle = 0;
        let Chain1AroundSprocket = 0, Chain2AroundSprocket = 0;
        let xTangent1 = 0, yTangent1 = 0, xTangent2 = 0, yTangent2 = 0;

        //Calculate the chain angles from horizontal, based on if the chain connects to the sled from the top or bottom of the sprocket
        const yDiff = this.yCordOfMotor - yTarget;
        if (this.opts.chainOverSprocket === 1) {
            Chain1Angle = Math.asin(yDiff / Motor1Distance) + Math.asin(this.sprocketRadius / Motor1Distance);
            Chain2Angle = Math.asin(yDiff / Motor2Distance) + Math.asin(this.sprocketRadius / Motor2Distance);

            Chain1AroundSprocket = this.sprocketRadius * Chain1Angle;
            Chain2AroundSprocket = this.sprocketRadius * Chain2Angle;

            xTangent1 = -1.0 * this.xCordOfMotor + this.sprocketRadius * Math.sin(Chain1Angle);
            yTangent1 = this.yCordOfMotor + this.sprocketRadius * Math.cos(Chain1Angle);

            xTangent2 = this.xCordOfMotor - this.sprocketRadius * Math.sin(Chain2Angle);
            yTangent2 = this.yCordOfMotor + this.sprocketRadius * Math.cos(Chain2Angle);
        } else {
            Chain1Angle = Math.asin(yDiff / Motor1Distance) - Math.asin(this.sprocketRadius / Motor1Distance);
            Chain2Angle = Math.asin(yDiff / Motor2Distance) - Math.asin(this.sprocketRadius / Motor2Distance);

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
        const srsqrd = Math.pow(this.sprocketRadius, 2);
        const Chain1Straight = Math.sqrt(Math.pow(Motor1Distance, 2) - srsqrd);
        const Chain2Straight = Math.sqrt(Math.pow(Motor2Distance, 2) - srsqrd);

        // Calculate chain tension
        const tw = sledWeight + 0.5 * chainDensity * (Chain1Straight + Chain2Straight);
        const tensionD = (xTangent1 * yTangent2 - xTangent2 * yTangent1 - xTangent1 * yTarget +
            xTarget * yTangent1 + xTangent2 * yTarget - xTarget * yTangent2);
        const tension1 = -(tw * Math.sqrt(Math.pow(xTangent1 - xTarget, 2.0) + Math.pow(yTangent1 - yTarget, 2.0)) * (xTangent2 - xTarget)) / tensionD;
        const tension2 = (tw * Math.sqrt(Math.pow(xTangent2 - xTarget, 2.0) + Math.pow(yTangent2 - yTarget, 2.0)) * (xTangent1 - xTarget)) / tensionD;
        const horizontalTension = tension1 * (xTarget - xTangent1) / Chain1Straight;
        const a1 = horizontalTension / chainDensity;
        const a2 = horizontalTension / chainDensity;

        // Catenary equation: total chain length excluding sprocket geometry, chain tolerance, and chain elasticity
        let chain1 = Math.sqrt(Math.pow(2 * a1 * Math.sinh((xTarget - xTangent1) / (2 * a1)), 2) + Math.pow(yTangent1 - yTarget, 2));
        let chain2 = Math.sqrt(Math.pow(2 * a2 * Math.sinh((xTangent2 - xTarget) / (2 * a2)), 2) + Math.pow(yTangent2 - yTarget, 2));

        //Calculate total chain lengths accounting for sprocket geometry, chain tolerance, and chain elasticity
        chain1 = Chain1AroundSprocket + chain1 / (1.0 + this.opts.leftChainTolerance / 100.0) / (1.0 + tension1 * chainElasticity);
        chain2 = Chain2AroundSprocket + chain2 / (1.0 + this.opts.rightChainTolerance / 100.0) / (1.0 + tension2 * chainElasticity);

        //Subtract of the virtual length which is added to the chain by the rotation mechanism
        return [chain1 - this.opts.rotationDiskRadius, chain2 - this.opts.rotationDiskRadius];
    }
}

export default MaslowKinematics;
