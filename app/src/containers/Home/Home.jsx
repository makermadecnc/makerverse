import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './index.styl';
import CreateWorkspace from './CreateWorkspace';
// import ReactDOM from 'react-dom';

class Home extends PureComponent {
    state = { bkColor: null };

    static propTypes = {
        ...withRouter.propTypes,
        isActive: PropTypes.bool.isRequired,
    };

    render() {
        const { className, isActive } = this.props;
        const { bkColor } = this.state;

        const style = bkColor ? { backgroundColor: bkColor } : {};

        return (
            <div
                className={classNames(className, styles.home)}
                style={style}
            >
                {isActive && (
                    <CreateWorkspace
                        setBackgroundColor={(c) => this.setState({ bkColor: c })}
                    />
                )}
            </div>
        );
    }
}

export default withRouter(Home);
