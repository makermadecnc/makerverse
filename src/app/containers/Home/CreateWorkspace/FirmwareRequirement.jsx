import _ from 'lodash';
import React from 'react';
import i18n from 'app/lib/i18n';
import analytics from 'app/lib/analytics';
import { ToastNotification } from 'app/components/Notifications';

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
            <analytics.OutboundLink
                eventLabel="firmware_help"
                to={fw.helpUrl}
                target="_blank"
            >
                {i18n._('Get Help')}
            </analytics.OutboundLink>
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
        const levels = ['error', 'warning', 'info'];
        for (var i = 0; i < levels.length; i++) {
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
        const latestVersion = firmware.suggestedVersion || firmware.requiredVersion;
        const downloadText = hasProblem ? compatibility[severity] :
            i18n._('Download v{{ version }}', { version: latestVersion });

        return (
            <ToastNotification type={severity}>
                <h6 style={{ marginTop: 0 }}>
                    {i18n._('Firmware: {{ name }}', { name: firmware.name })}
                </h6>
                {this.renderDownloadText(firmware, downloadText)}
                <br />
                {showHelp && this.renderHelpLink(firmware)}
            </ToastNotification>
        );
    }
}

export default FirmwareRequirement;
