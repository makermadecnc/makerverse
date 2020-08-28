import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
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
        const { state } = this.props;
        const { version } = state;

        return (
            <div>
                <AboutContainer version={version} />
                <HelpContainer />
                <UpdateStatusContainer version={version} />
            </div>
        );
    }
}

export default About;
