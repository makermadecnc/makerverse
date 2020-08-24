import _ from 'lodash';
import settings from '../config/settings';
import { ensureNumber, ensureString, ensureBoolean } from '../lib/ensure-type';
import logger from '../lib/logger';
import slugify from '../lib/slugify';
import config from '../services/configstore';
import { getPagingRange } from './paging';
import {
    ERR_BAD_REQUEST,
    ERR_NOT_FOUND,
    ERR_INTERNAL_SERVER_ERROR
} from '../constants';

const log = logger('api:workspaces');
const CONFIG_KEY = 'workspaces';

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

const ensureWorkspace = (payload) => {
    const { id, path, name, controller, limits } = { ...payload };
    const { port, baudRate, reconnect, controllerType, rtscts } = { ...controller };
    const { xmin = 0, xmax = 0, ymin = 0, ymax = 0, zmin = 0, zmax = 0 } = { ...limits };

    return {
        id,
        path,
        name: ensureString(name),
        controller: {
            controllerType: ensureString(controllerType),
            port: ensureString(port),
            baudRate: ensureNumber(baudRate),
            rtscts: ensureBoolean(rtscts),
            reconnect: ensureBoolean(reconnect),
        },
        limits: {
            xmin: ensureNumber(xmin) || 0,
            xmax: ensureNumber(xmax) || 0,
            ymin: ensureNumber(ymin) || 0,
            ymax: ensureNumber(ymax) || 0,
            zmin: ensureNumber(zmin) || 0,
            zmax: ensureNumber(zmax) || 0,
        },
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

    if (!record.name) {
        res.status(ERR_BAD_REQUEST).send({
            msg: 'The "name" parameter must not be empty'
        });
        return;
    }

    try {
        const records = getSanitizedRecords();
        records.push(ensureWorkspace(record));
        config.set(CONFIG_KEY, records);

        res.send({ id: record.id });
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

        [ // [key, ensureType]
            ['name', ensureString],
            ['limits.xmin', ensureNumber],
            ['limits.xmax', ensureNumber],
            ['limits.ymin', ensureNumber],
            ['limits.ymax', ensureNumber],
            ['limits.zmin', ensureNumber],
            ['limits.zmax', ensureNumber],
        ].forEach(it => {
            const [key, ensureType] = it;
            const defaultValue = _.get(record, key);
            const value = _.get(nextRecord, key, defaultValue);

            _.set(record, key, (typeof ensureType === 'function') ? ensureType(value) : value);
        });

        config.set(CONFIG_KEY, records);

        res.send({ id: record.id });
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
