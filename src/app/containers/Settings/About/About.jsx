import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import i18n from 'app/lib/i18n';
import AboutContainer from './AboutContainer';
import HelpContainer from './HelpContainer';
import UpdateStatusContainer from './UpdateStatusContainer';

class About extends PureComponent {
    static propTypes = {
        initialState: PropTypes.object,
        state: PropTypes.object,
        stateChanged: PropTypes.bool,
        actions: PropTypes.object
    };

    componentDidMount() {
        const { actions } = this.props;
        actions.checkLatestVersion();
    }

    render() {
        const { state, actions } = this.props;
        const { prereleases, version } = state;

        return (
            <div>
                <AboutContainer version={version} />
                <label>
                    <input
                        type="checkbox"
                        defaultChecked={prereleases}
                        onChange={actions.togglePrereleases}
                    />
                    {' '}{i18n._('Prereleases (beta channel)')}
                </label>
                <HelpContainer />
                <UpdateStatusContainer
                    checking={version.checking}
                    current={version.current}
                    latest={version.latest}
                    lastUpdate={version.lastUpdate}
                />
            </div>
        );
    }
}

export default About;
