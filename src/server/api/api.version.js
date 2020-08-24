import _ from 'lodash';
import request from 'superagent';
import {
    ERR_INTERNAL_SERVER_ERROR
} from '../constants';

const releasesUrl = 'https://api.github.com/repos/makermadecnc/makerverse/releases';

export const getLatestVersion = (req, res) => {
    request
        .get(releasesUrl)
        .end((err, _res) => {
            if (err) {
                res.status(ERR_INTERNAL_SERVER_ERROR).send({
                    msg: `Failed to connect to ${releasesUrl}: code=${err.code}`
                });
                return;
            }

            const { body: data = [] } = { ..._res };
            const rel = _.findLastIndex(data, { draft: false, prerelease: false });
            const pre = _.findLastIndex(data, { draft: false, prerelease: true });

            res.send({
                prerelease: data[pre],
                release: data[rel],
            });
        });
};
