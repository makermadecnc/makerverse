import _ from 'lodash';
import React from 'react';
import { Alert } from '@material-ui/core';
import i18n from 'lib/i18n';
import analytics from 'lib/analytics';

class FirmwareRequirement extends React.PureComponent {
    state = { };

    renderHelpLink(fw) {
        if (!fw || !fw.helpUrl) {
            return (
                <div>
                    <i>{i18n._('Sorry, we don\'t have any docs on this firmware. ')}</i>
                    <analytics.OutboundLink
                        eventLabel="firmware_contribute"
                        to="http://makerverse.com/contribute/"
                        target="_blank"
                    >
                        {i18n._('Contribute')}
                    </analytics.OutboundLink>
                </div>
            );
        }

        return (
            <span>
                {' ('}
                <analytics.OutboundLink
                    eventLabel="firmware_help"
                    to={fw.helpUrl}
                    target="_blank"
                >
                    {i18n._('Get Help')}
                </analytics.OutboundLink>
                )
            </span>
        );
    }

    renderDownloadText(fw, text) {
        if (!fw.downloadUrl) {
            return text;
        }
        return (
            <analytics.OutboundLink
                eventLabel="firmware_download"
                to={fw.downloadUrl}
                target="_blank"
            >
                {text}
            </analytics.OutboundLink>
        );
    }

    getSeverity(compatibility) {
        const levels = ['error', 'warning', 'info', 'success'];
        for (let i = 0; i < levels.length; i++) {
            if (_.has(compatibility || {}, levels[i])) {
                return levels[i];
            }
        }
        return '';
    }

    render() {
        const { firmware, compatibility } = this.props;
        const severity = this.getSeverity(compatibility);
        const isOk = severity !== 'warning' && severity !== 'error';
        const showHelp = !compatibility || !isOk;
        const hasProblem = compatibility && !isOk;
        const showDownload = hasProblem || !compatibility;
        const latestVersion = firmware.suggestedVersion || firmware.requiredVersion;
        const dlText = hasProblem ? compatibility[severity]
            : i18n._('Download v{{ version }}', { version: latestVersion });

        return (
            <Alert severity={severity}>
                {showDownload && this.renderDownloadText(firmware, dlText)}
                {!showDownload && compatibility[severity]}
                <br />
                {showHelp && this.renderHelpLink(firmware)}
            </Alert>
        );
    }
}

export default FirmwareRequirement;
