import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './index.styl';
import CreateWorkspace from './CreateWorkspace';
// import ReactDOM from 'react-dom';

class Home extends PureComponent {
    static propTypes = {
        ...withRouter.propTypes,
        isActive: PropTypes.bool.isRequired,
    };

    render() {
        const { className, isActive } = this.props;

        return (
            <div className={classNames(className, styles.home)}>
                {isActive && <CreateWorkspace />}
            </div>
        );
    }
}

export default withRouter(Home);
