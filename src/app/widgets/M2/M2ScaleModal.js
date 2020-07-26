/* eslint-disable */
import React, { PureComponent } from 'react';
import styles from './index.styl';
import classnames from 'classnames';
import i18n from 'app/lib/i18n';
import { in2mm } from 'app/lib/units';

class M2ScaleModal extends PureComponent {
  state = {
    values: {},
    activeTab: { name: '', gCode: '' },
    expectedLength: 0,
    expectedUnit: 'mm',
    actualLength: 0,
    actualUnit: 'mm'
  };
  componentDidMount() {
    const obj = {};
    this.props.modalConfig.map(conf => {
      obj[conf.gCode] = {
        value: this.props.controllerSettings[conf.gCode],
        units: 'mm'
      };
    });
    this.setState({
      values: obj,
      activeTab: {
        name: this.props.modalConfig[0].name,
        gCode: this.props.modalConfig[0].gCode
      }
    });
  }

  handleSubmit = e => {
    const {
      values,
      expectedLength,
      actualLength,
      activeTab,
      expectedUnit,
      actualUnit
    } = this.state;
    e.preventDefault();
    const parsedExpected =
      expectedUnit === 'mm' ? expectedLength : in2mm(expectedLength);
    const parsedActual =
      actualUnit === 'mm' ? actualLength : in2mm(actualLength);
    const newScale =
      parseInt(values[activeTab.gCode].value) * (parsedExpected / parsedActual);
    const subObj = {
      [activeTab.gCode]: { value: newScale, units: 'mm' }
    };
    this.props.handleCalibrate(subObj);
  };
  handleTab = conf => {
    this.setState({
      activeTab: { name: conf.name, gCode: conf.gCode },
      expectedLength: 0,
      expectedUnit: 'mm',
      actualLength: 0,
      actualUnit: 'mm'
    });
  };
  render() {
    const {
      modalImg,
      modalConfig,
      handleCalibrate,
      controllerSettings,
      handleClose
    } = this.props;
    const {
      values,
      activeTab,
      expectedLength,
      actualLength,
      expectedUnit,
      actualUnit
    } = this.state;
    return (
      <div className={styles['modal-background']}>
        <div className={styles['modal-container']}>
          <div className={styles['modal-tabs-container']}>
            {modalConfig.map(conf => (
              <button
                onClick={() => this.handleTab(conf)}
                key={`tab - ${conf.name}`}
                className={classnames(styles['modal-tab'], {
                  [styles['modal-tab-active']]: conf.name === activeTab.name
                })}
              >
                {conf.name}
              </button>
            ))}
          </div>
          <h2>{activeTab.name}</h2>
          <img src={modalImg} />
          <form onSubmit={this.handleSubmit}>
            <div className={styles['input-field']}>
              <label htmlFor="expected">Expected Length:</label>
              <div>
                <input
                  type="text"
                  name="expected"
                  value={expectedLength}
                  onChange={e => {
                    this.setState({ expectedLength: e.target.value });
                  }}
                />
                <select
                  style={{ height: '26px', marginLeft: '4px' }}
                  value={expectedUnit}
                  onChange={e =>
                    this.setState({
                      expectedUnit: e.target.value,
                      expectedLength: 0
                    })
                  }
                >
                  <option value="mm">mm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
            <div className={styles['input-field']}>
              <label htmlFor="actual">Actual Length:</label>
              <div>
                <input
                  type="text"
                  name="actual"
                  value={actualLength}
                  onChange={e => {
                    this.setState({ actualLength: e.target.value });
                  }}
                />
                <select
                  style={{ height: '26px', marginLeft: '4px' }}
                  value={actualUnit}
                  onChange={e =>
                    this.setState({
                      actualUnit: e.target.value,
                      actualLength: 0
                    })
                  }
                >
                  <option value="mm">mm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
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

export default M2ScaleModal;
