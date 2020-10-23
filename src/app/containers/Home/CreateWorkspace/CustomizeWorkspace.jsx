import React from 'react';
import i18n from 'app/lib/i18n';
import styles from './index.styl';

class CustomizeWorkspace extends React.PureComponent {
    state = { autoReconnect: false };

    render() {
        const { autoReconnect } = this.state;
        const { connectionStatus } = this.props;
        const rowStyle = { padding: 10 };
        return (
            <div style={{ margin: 0, padding: 0 }}>
                <div className={styles.widgetHeader}>
                    <h6>{i18n._('Customize Workspace')}</h6>
                </div>
                {connectionStatus.hasValidFirmware && (
                    <div className={styles.widgetCenter}>
                        <div className="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    defaultChecked={autoReconnect}
                                    onChange={() => this.setState({ autoReconnect: !autoReconnect })}
                                />
                                {i18n._('Connect automatically')}
                            </label>
                        </div>
                        <div style={rowStyle}>
                            Name:
                        </div>
                        <div style={rowStyle}>
                            Icon:
                        </div>
                        <div style={rowStyle}>
                            Color:
                        </div>
                    </div>
                )}
                {!connectionStatus.hasValidFirmware && (
                    <div
                        className={styles.widgetCenter}
                        style={{ fontStyle: 'italic', padding: 20, textAlign: 'center' }}
                    >
                        {i18n._('Please connect to your machine, first.')}
                    </div>
                )}
            </div>
        );
    }
}

export default CustomizeWorkspace;
