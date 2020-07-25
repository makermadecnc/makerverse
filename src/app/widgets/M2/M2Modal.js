/* eslint-disable */
import React, { PureComponent } from 'react';
import styles from './index.styl';
import classnames from 'classnames';
import i18n from 'app/lib/i18n';
class M2Modal extends PureComponent {
  state = {
    values: {},
    metric: 'mm'
  };
  componentDidMount() {
    const obj = {};
    this.props.modalConfig.map(conf => {
      obj[conf.gCode] = this.props.controllerSettings[conf.gCode];
    });
    this.setState({ values: obj });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleCalibrate(this.state.values, this.state.metric);
  };
  render() {
    const {
      modalImg,
      modalConfig,
      handleCalibrate,
      controllerSettings,
      handleClose
    } = this.props;
    const { values, metric } = this.state;
    return (
      <div className={styles['modal-background']}>
        <div className={styles['modal-container']}>
          <h2>Calibrate</h2>
          <img src={modalImg} />
          <form onSubmit={this.handleSubmit}>
            {modalConfig.map(conf => (
              <div key={`form-${conf.for}`} className={styles['input-field']}>
                <label htmlFor={conf.for}>{conf.name}</label>
                <div>
                  <input
                    type="text"
                    name={conf.for}
                    value={
                      values[conf.gCode] !== undefined ? values[conf.gCode] : 0
                    }
                    onChange={e => {
                      this.setState({
                        values: { ...values, [conf.gCode]: e.target.value }
                      });
                    }}
                  />
                  <select
                    style={{ height: '26px', marginLeft: '4px' }}
                    value={metric}
                    onChange={e =>
                      this.setState({ metric: e.target.value, values: {} })
                    }
                  >
                    <option value="mm">
                      mm
                    </option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
            ))}
            <div className={classnames(styles['button-container'])}>
              <button
                type="button"
                className={classnames(
                  'btn btn-danger',
                  styles['widget-button']
                )}
                onClick={handleClose}
              >
                {i18n._('Close')}
              </button>
              <button
                type="submit"
                className={classnames(
                  'btn btn-success',
                  styles['widget-button']
                )}
              >
                {i18n._('Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default M2Modal;
