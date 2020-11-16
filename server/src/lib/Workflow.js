import events from 'events';

// Workflow State
export const WORKFLOW_STATE_RUNNING = 'running';
export const WORKFLOW_STATE_PAUSED = 'paused';
export const WORKFLOW_STATE_IDLE = 'idle';

class Workflow extends events.EventEmitter {
    state = WORKFLOW_STATE_IDLE;

    isRunning() {
        return this.state === WORKFLOW_STATE_RUNNING;
    }

    isPaused() {
        return this.state === WORKFLOW_STATE_PAUSED;
    }

    isIdle() {
        return this.state === WORKFLOW_STATE_IDLE;
    }

    start(...args) {
        if (this.state !== WORKFLOW_STATE_RUNNING) {
            this.state = WORKFLOW_STATE_RUNNING;
            this.emit('start', ...args);
        }
    }

    stop(...args) {
        if (this.state !== WORKFLOW_STATE_IDLE) {
            this.state = WORKFLOW_STATE_IDLE;
            this.emit('stop', ...args);
        }
    }

    pause(...args) {
        if (this.state === WORKFLOW_STATE_RUNNING) {
            this.state = WORKFLOW_STATE_PAUSED;
            this.emit('pause', ...args);
        }
    }

    resume(...args) {
        if (this.state === WORKFLOW_STATE_PAUSED) {
            this.state = WORKFLOW_STATE_RUNNING;
            this.emit('resume', ...args);
        }
    }
}

export default Workflow;
