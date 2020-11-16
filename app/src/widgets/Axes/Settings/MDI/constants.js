import constants from 'namespace-constants';
import { v4 as uuid } from 'uuid';

export const {
    MODAL_CREATE_RECORD,
    MODAL_UPDATE_RECORD
} = constants(uuid(), [
    'MODAL_CREATE_RECORD',
    'MODAL_UPDATE_RECORD'
]);
