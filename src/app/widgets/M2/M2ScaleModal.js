/* eslint-disable */
import React, { PureComponent } from 'react';
import styles from './index.styl';
import classnames from 'classnames';
import i18n from 'app/lib/i18n';
import { in2mm } from 'app/lib/units';
import controller from 'app/lib/controller';

class M2ScaleModal extends PureComponent {
  state = {
    values: {},
    activeTab: { name: '', gCode: '', img: '', dimension: '' },
    expectedLength: 0,
    expectedUnit: 'mm',
    actualLength: 0,
    actualUnit: 'mm'
  };
  componentDidMount() {
    const { modalConfig } = this.props;
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
        name: modalConfig[0].name,
        gCode: modalConfig[0].gCode,
        img: modalConfig[0].img,
        dimension: modalConfig[0].dimension
      }
    });
  }

  handleSubmit = e => {
    controller.command('gcode', 'G90');
    controller.command('gcode', 'G21');
    controller.command('gcode', 'G0 X0 Y0 Z0');
    /*
    const {
      values,
      expectedLength,
      actualLength,
      activeTab,
      expectedUnit,
      actualUnit
    } = this.state;
    e.preventDefault();
    const currentVal =
      parseFloat(values[activeTab.gCode].value) !== 0
        ? parseFloat(values[activeTab.gCode].value)
        : 1;
    const parsedExpected =
      expectedUnit === 'mm' ? expectedLength : in2mm(expectedLength);
    const parsedActual =
      actualUnit === 'mm' ? actualLength : in2mm(actualLength);
    const newScale = currentVal * (parsedExpected / parsedActual);
    const subObj = {
      [activeTab.gCode]: { value: newScale, units: 'mm' }
    };
    this.props.handleCalibrate(subObj);*/
  };
  handleTab = conf => {
    this.setState({
      activeTab: {
        name: conf.name,
        gCode: conf.gCode,
        img: conf.img,
        dimension: conf.dimension
      },
      expectedLength: 0,
      expectedUnit: 'mm',
      actualLength: 0,
      actualUnit: 'mm'
    });
  };
  render() {
    const {
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
          <img src={activeTab.img} />
          <form onSubmit={this.handleSubmit}>
            <div className={styles['input-field']}>
              <label htmlFor="expected">Expected {activeTab.dimension}:</label>
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
              <label htmlFor="actual">Actual {activeTab.dimension}:</label>
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
                {i18n._('Cancel')}
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
