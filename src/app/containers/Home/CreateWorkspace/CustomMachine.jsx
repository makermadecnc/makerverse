import React from 'react';
import _ from 'lodash';
import cx from 'classnames';
import i18n from 'app/lib/i18n';
import Select from 'react-select';
import { Input } from 'app/components/FormControl';
import {
    GRBL,
} from 'app/constants';
import styles from './index.styl';

class CustomMachine extends React.PureComponent {
    state = {
        customMachine: {
            brand: '',
            model: '',
        },
        firmwareSettings: {
            baudRate: null,
            controllerType: GRBL,
            rtscts: false,
        }
    };

    renderBaudrateValue = (option) => {
        const style = {
            color: '#333',
            textOverflow: 'ellipsis',
            overflow: 'hidden'
        };
        return (
            <div style={style} title={option.label}>{option.label}</div>
        );
    };

    onChange = (g, k, v) => {
        const s = { ...this.state };
        s[g][k] = v;
        this.setState({ [g]: { ...this.state[g], [k]: v } });
        this.props.onSelected(s.firmwareSettings, s.customMachine);
    };

    render() {
        const { controller, disabled } = this.props;
        const { firmwareSettings, customMachine } = this.state;
        const { brand, model } = customMachine;
        const { baudRate, rtscts, controllerType } = firmwareSettings;
        const defaultBaudrates = [
            250000,
            115200,
            57600,
            38400,
            19200,
            9600,
            2400
        ];
        const baudRates = _.reverse(_.sortBy(_.uniq(controller.baudrates.concat(defaultBaudrates))));

        return (
            <div>
                <div className={cx('form-group', styles.widgetHeader)}>
                    <div className="input-group input-group-sm">
                        <h6>Machine Controllers</h6>
                        {baudRate && (
                            <div className="input-group-btn">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        this.onChange('firmwareSettings', 'baudRate', null);
                                    }}
                                >
                                    {i18n._('Cancel')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={ cx(styles.widgetCenter, styles.customMachine) }>
                    <div style={{ padding: 10 }} >
                        <div className="input-group-btn" style={{ textAlign: 'center' }}>
                            {controller.loadedControllers.map((ct) => {
                                return (
                                    <button
                                        type="button"
                                        key={ct}
                                        className={cx(
                                            'btn',
                                            'btn-default',
                                            { 'btn-select': controllerType === ct }
                                        )}
                                        disabled={disabled}
                                        onClick={() => {
                                            this.onChange('firmwareSettings', 'controllerType', ct);
                                        }}
                                    >
                                        {ct}
                                    </button>
                                );
                            })}
                        </div>
                        <br />
                        <br />
                        <div className="container-fluid">
                            <div className="row">
                                <div className="form-group col-lg-4">
                                    <label className="control-label">{i18n._('Brand')}</label>
                                    <Input
                                        type="text"
                                        name="brand"
                                        className="form-control"
                                        placeholder={i18n._('Who made the machine?')}
                                        value={brand}
                                        onChange={e => {
                                            this.onChange('customMachine', 'brand', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-lg-4">
                                    <label className="control-label">{i18n._('Model')}</label>
                                    <Input
                                        type="text"
                                        name="model"
                                        className="form-control"
                                        placeholder={i18n._('Part number or designation')}
                                        value={model}
                                        onChange={e => {
                                            this.onChange('customMachine', 'model', e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-lg-3">
                                    <label className="control-label">{i18n._('Baud rate')}</label>
                                    <Select
                                        backspaceRemoves={false}
                                        className="sm"
                                        clearable={false}
                                        menuContainerStyle={{ zIndex: 9999 }}
                                        name="baudrate"
                                        onChange={(o) => {
                                            this.onChange('firmwareSettings', 'baudRate', o.value);
                                        }}
                                        options={_.map(baudRates, (value) => ({
                                            value: value,
                                            label: Number(value).toString()
                                        }))}
                                        placeholder={i18n._('Choose a baud rate')}
                                        searchable={false}
                                        value={baudRate}
                                        valueRenderer={this.renderBaudrateValue}
                                        disabled={disabled}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className={cx('checkbox', {
                                'disabled': disabled
                            })}
                        >
                            <label>
                                <input
                                    type="checkbox"
                                    defaultChecked={rtscts}
                                    onChange={() => {
                                        this.onChange('firmwareSettings', 'rtscts', !rtscts);
                                    }}
                                    disabled={disabled}
                                />
                                {i18n._('Enable hardware flow control')}
                            </label>
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default CustomMachine;
