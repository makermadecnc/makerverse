import _ from 'lodash';
import settings from '../config/settings';
import { ensureNumber, ensureString, ensureBoolean, ensureObject } from '../lib/ensure-type';
import logger from '../lib/logger';
import slugify from '../lib/slugify';
import config from '../services/configstore';
import { getPagingRange } from './paging';
import {
    ERR_BAD_REQUEST,
    ERR_NOT_FOUND,
    ERR_INTERNAL_SERVER_ERROR
} from '../constants';
import { MASLOW } from '../controllers/Maslow/constants';
import { GRBL } from '../controllers/Grbl/constants';

const log = logger('api:workspaces');
const CONFIG_KEY = 'workspaces';

const defaultFeatures = {
    [MASLOW]: {
        homing: {
            title: 'Reset Chains',
            description: 'Inform the Maslow that the chains (not the sled) are in the exact same position as they were when you used "Set Chains".',
            icon: 'fa-link',
        },
        mpos_set_home_x: false,
        mpos_set_home_y: false,
        mpos_go_home_x: false,
        mpos_go_home_y: false,
        mpos_go_home_z: false,
    }
};

const defaultAxes = {
    // accuracy: [mm] serves to calculate minimum movement in the axis
    // precision: [int] number of decimals for rounding
    [MASLOW]: {
        x: {
            accuracy: 1,
            precision: 0,
            min: -1219.2,
            max: 1219.2,
        },
        y: {
            accuracy: 1,
            precision: 0,
            min: -609.6,
            max: 609.6,
        },
        z: {
            accuracy: 0.1,
            precision: 1,
            min: -25.4,
            max: 12.0,
        },
    },
    [GRBL]: {
        x: {
            accuracy: 0.1,
            precision: 2,
            min: -300,
            max: 300,
        },
        y: {
            accuracy: 0.1,
            precision: 2,
            min: -300,
            max: 300,
        },
        z: {
            accuracy: 0.1,
            precision: 2,
            min: -30,
            max: 30,
        },
    },
    '': {
        x: {
            accuracy: 0.001,
            precision: 3,
            min: -300,
            max: 300,
        },
        y: {
            accuracy: 0.001,
            precision: 3,
            min: -300,
            max: 300,
        },
        z: {
            accuracy: 0.001,
            precision: 3,
            min: -30,
            max: 30,
        },
    },
};

const getSanitizedRecords = () => {
    const records = _.castArray(config.get(CONFIG_KEY, []));
    const ids = [];

    let shouldUpdate = false;
    for (let i = 0; i < records.length; ++i) {
        if (!_.isPlainObject(records[i]) || !records[i].name || records[i].name.length <= 0) {
            records[i] = {};
        }

        const record = records[i];

        if (!record.id || record.id.length <= 0) {
            record.id = slugify(record.name);
            shouldUpdate = true;
        }
        if (!record.path) {
            record.path = `/${record.id}`;
            shouldUpdate = true;
        }

        if (ids.includes(record.id)) {
            log.error(`Duplicate workspace ID: ${record.id}`);
        } else {
            ids.push(record.id);
        }
    }

    if (shouldUpdate) {
        log.debug(`update sanitized records: ${JSON.stringify(records)}`);

        // Pass `{ silent changes }` will suppress the change event
        config.set(CONFIG_KEY, records, { silent: true });
    }

    return records;
};

const ensureAxis = (payload) => {
    const { min, max, precision, accuracy } = { ...payload };
    return {
        precision: ensureNumber(precision) || 0,
        accuracy: ensureNumber(accuracy) || 0,
        min: ensureNumber(min) || 0,
        max: ensureNumber(max) || 0,
    };
};

const ensureWorkspace = (payload) => {
    const { name, onboarded, controller, features, axes } = { ...payload };
    const { port, baudRate, reconnect, controllerType, rtscts } = { ...controller };
    const id = payload.id || slugify(name);
    const path = payload.path || `/${id}`;
    const ax = { ...(defaultAxes[controllerType] || defaultAxes['']), ...ensureObject(axes) };
    const ft = { ...(defaultFeatures[controllerType] || {}), ...ensureObject(features) };
    Object.keys(ax).forEach((axis) => {
        ax[axis] = ensureAxis(ax[axis]);
    });

    return {
        id,
        path,
        name: ensureString(name),
        onboarded: ensureBoolean(onboarded),
        controller: {
            controllerType: ensureString(controllerType),
            port: ensureString(port),
            baudRate: ensureNumber(baudRate),
            rtscts: ensureBoolean(rtscts),
            reconnect: ensureBoolean(reconnect),
        },
        axes: ax,
        features: ft,
    };
};

export const fetch = (req, res) => {
    const records = getSanitizedRecords();
    const paging = !!req.query.paging;

    if (paging) {
        const { page = 1, pageLength = 10 } = req.query;
        const totalRecords = records.length;
        const [begin, end] = getPagingRange({ page, pageLength, totalRecords });
        const pagedRecords = records.slice(begin, end);

        res.send({
            pagination: {
                page: Number(page),
                pageLength: Number(pageLength),
                totalRecords: Number(totalRecords)
            },
            records: pagedRecords.map(record => ensureWorkspace(record))
        });
    } else {
        res.send({
            records: records.map(record => ensureWorkspace(record))
        });
    }
};

export const create = (req, res) => {
    const record = { ...req.body };

    if (!record.name || record.name.length <= 0) {
        res.status(ERR_BAD_REQUEST).send({
            msg: 'The "name" parameter must not be empty'
        });
        return;
    }
    const records = getSanitizedRecords();
    const ws = ensureWorkspace(record);
    const existing = _.find(records, { id: ws.id });
    if (existing) {
        res.status(ERR_BAD_REQUEST).send({
            msg: `The workspace already exists: ${ws.id}`
        });
        return;
    }

    try {
        records.push(ws);
        config.set(CONFIG_KEY, records);

        res.send(ws);
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};

export const read = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _.find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    res.send(ensureWorkspace(record));
};

const validateAxis = (axis) => {
    return [
        [`axes.${axis}.min`, ensureNumber],
        [`axes.${axis}.max`, ensureNumber],
        [`axes.${axis}.precision`, ensureNumber],
        [`axes.${axis}.accuracy`, ensureNumber],
    ];
};

export const update = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _.find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    try {
        const nextRecord = req.body;

        let validators = [ // [key, ensureType]
            ['name', ensureString],
            ['onboarded', ensureBoolean],
            ['controller.controllerType', ensureString],
            ['controller.port', ensureString],
            ['controller.baudRate', ensureNumber],
            ['features', ensureObject],
            ['axes', ensureObject],
        ];
        const knownAxes = _.get(record, 'axes', {});
        Object.keys(knownAxes).forEach((axis) => {
            validators = validators.concat(validateAxis(axis));
        });

        validators.forEach(it => {
            const [key, ensureType] = it;
            const defaultValue = _.get(record, key);
            const value = _.get(nextRecord, key, defaultValue);

            _.set(record, key, (typeof ensureType === 'function') ? ensureType(value) : value);
        });

        config.set(CONFIG_KEY, records);

        res.send(record);
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};

export const __delete = (req, res) => {
    const id = req.params.id;
    const records = getSanitizedRecords();
    const record = _.find(records, { id: id });

    if (!record) {
        res.status(ERR_NOT_FOUND).send({
            msg: 'Not found'
        });
        return;
    }

    try {
        const filteredRecords = records.filter(record => {
            return record.id !== id;
        });
        config.set(CONFIG_KEY, filteredRecords);

        res.send({ id: record.id });
    } catch (err) {
        res.status(ERR_INTERNAL_SERVER_ERROR).send({
            msg: 'Failed to save ' + JSON.stringify(settings.rcfile)
        });
    }
};
