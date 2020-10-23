import React from 'react';
import i18n from 'app/lib/i18n';
import analytics from 'app/lib/analytics';

class FirmwareRequirement extends React.PureComponent {
    state = { };

    render() {
        const { firmware } = this.props;
        if (firmware.length <= 0 || !firmware[0].helpUrl && !firmware[0].downloadUrl) {
            return (
                <div>
                    <i>{i18n._('Sorry, we don\'t have any docs on this firmware.')}</i>
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
            <div>
                {firmware.map(fw => {
                    return (
                        <div key={fw.id}>
                            <h6>{this.props.title || i18n._('Required Firmware')}</h6>
                            {fw.helpUrl && (
                                <analytics.OutboundLink
                                    eventLabel="firmware_help"
                                    to={fw.helpUrl}
                                    target="_blank"
                                >
                                    {fw.name}
                                </analytics.OutboundLink>
                            )}
                            {!fw.downloadUrl && fw.name}
                            {' (v'}{fw.downloadUrl && (
                                <analytics.OutboundLink
                                    eventLabel="firmware_download"
                                    to={fw.downloadUrl}
                                    target="_blank"
                                >
                                    {fw.requiredVersion}
                                </analytics.OutboundLink>
                            )}
                            {!fw.downloadUrl && fw.requiredVersion}{')'}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FirmwareRequirement;
