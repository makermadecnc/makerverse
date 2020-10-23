import React from 'react';
import Select from 'react-select';
import _ from 'lodash';
import cx from 'classnames';
import i18n from 'app/lib/i18n';
import log from 'app/lib/log';
import { Input } from 'app/components/FormControl';
import FirmwareRequirement from './FirmwareRequirement';
import styles from './index.styl';

class ChooseMachine extends React.PureComponent {
    state = {
        selectedMachineProfileId: null,
        selectedMachineCategory: 'CNC',
        searchText: '',
        allPartTypes: [],
        selectedPartIds: {},
    };

    selectMachineProfile(mp) {
        log.debug('select machine profile', mp);
        if (mp && mp.firmware.length !== 1) {
            log.error('Invalid machine profile does not have exactly one firmware.');
            return;
        }
        const mpId = mp ? mp.id : null;
        let allPartTypes = [];
        const selectedPartIds = {};
        if (mpId) {
            const groupedParts = _.groupBy(mp.parts, 'partType');
            allPartTypes = Object.keys(groupedParts);
            allPartTypes.forEach((partType) => {
                const parts = groupedParts[partType];
                if (parts.length === 1) {
                    selectedPartIds[partType] = parts[0].id;
                }
            });
        } else {
            this.props.onSelectedMachineProfileAndParts(null, null);
        }
        this.setState({
            selectedMachineProfileId: mpId,
            allPartTypes: allPartTypes,
            selectedPartIds: selectedPartIds,
        });
    }

    selectPart(type, partOption) {
        const selectedPartIds = { ...this.state.selectedPartIds, [type]: partOption.value };
        const selectedPartTypes = Object.keys(selectedPartIds);
        const allPartTypes = this.state.allPartTypes;
        const unselectedPartTypes = _.difference(allPartTypes, selectedPartTypes);
        log.debug('select', type, partOption, selectedPartIds, unselectedPartTypes);
        this.setState({ ...this.state, selectedPartIds });

        if (unselectedPartTypes.length <= 0) {
            this.props.onSelectedMachineProfileAndParts(
                this.state.selectedMachineProfileId,
                this.state.selectedPartIds,
            );
        }
    }

    renderPartOption = (part) => {
        return (
            <div
                key={`opt_${part.id}`}
                className={styles.widgetDropdownOption}
                title={`[${part.partType.toLowerCase()}] ${part.name}`}
            >
                <strong>{part.name}</strong>
                <br />
                <i>{part.description}</i>
            </div>
        );
    };

    getPartTypeHeaderStrings = (partType) => {
        if (partType === 'BOARD') {
            return {
                title: i18n._('Board (PCB)'),
                subtitle: i18n._('Connects to your Makerverse computer (often via USB).')
            };
        }
        if (partType === 'SHIELD') {
            return {
                title: i18n._('Shield'),
                subtitle: i18n._('Used to control steppers; attaches to the board via many pins.')
            };
        }
        if (partType === 'SLED') {
            return {
                title: i18n._('Sled'),
                subtitle: i18n._('The housing for the cutter; slides against the stock.')
            };
        }
        return { title: partType.toLowerCase() };
    };

    renderMachineProfile(mp) {
        const groupedParts = _.groupBy(mp.parts, 'partType');
        const partTypes = Object.keys(groupedParts);
        const partRows = partTypes.map(pt => {
            const { title, subtitle } = this.getPartTypeHeaderStrings(pt);
            const st = styles.widgetBox;
            const parts = groupedParts[pt];
            const onlyPart = parts.length === 1 ? parts[0] : null;
            const hasSelectedPart = !onlyPart && _.has(this.state.selectedPartIds, pt);
            const selectedPartId = hasSelectedPart ? this.state.selectedPartIds[pt] : null;
            const selectedPart = hasSelectedPart ? _.find(parts, { id: selectedPartId }) : null;
            const needSelPrt = !onlyPart && !selectedPart;
            const clsn = !needSelPrt ? cx('col-lg-4', st) : cx('col-lg-4', st, styles.highlight);
            // const part = parts[0];
            return (
                <div className={clsn} key={pt} >
                    <h6>{title}</h6>
                    {subtitle && (<i>{subtitle}</i>)}
                    <br />
                    {onlyPart && ( // No part options; just telling the user.
                        <div>
                            <h6>{onlyPart.name}</h6>
                            <i>{i18n._('Required Part')}</i>
                        </div>
                    )}
                    {!onlyPart && ( // User must choose a part from options.
                        <Select
                            backspaceRemoves={false}
                            className="sm"
                            clearable={false}
                            menuContainerStyle={{ zIndex: 999999 }}
                            name={`part_${pt}`}
                            onChange={(o) => this.selectPart(pt, o)}
                            options={_.map(parts, p => ({
                                value: p.id,
                                label: p.name,
                            }))}
                            style={{ marginTop: 20 }}
                            placeholder={
                                i18n._('Select a {{ partType }}', { partType: pt.toLowerCase() })
                            }
                            searchable={false}
                            value={selectedPart}
                            valueRenderer={this.renderPartOption}
                            // disabled={disabled}
                        />
                    )}
                </div>
            );
        });
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-3" />
                    <div
                        className="col-lg-6"
                        style={{ textAlign: 'center', padding: 20 }}
                    >
                        <h6>{mp.name} ({mp.model})</h6>
                        <span style={{ fontStyle: 'italic' }}>{mp.description}</span>
                        <hr />
                        <b>{i18n._('Configure your Machine Settings:')}</b>
                    </div>
                    <div className="col-lg-3" />
                </div>
                <div className="row">
                    {partRows}
                </div>
                <div className="row">
                    <div className="col-lg-3" />
                    <div
                        className="col-lg-6"
                        style={{ textAlign: 'center', fontStyle: 'italic', padding: 20 }}
                    >
                        <FirmwareRequirement firmware={mp.firmware} >
                        </FirmwareRequirement>
                    </div>
                    <div className="col-lg-3" />
                </div>
            </div>
        );
    }

    renderMachineProfiles(mps) {
        return mps.map(mp => {
            const st = mps.indexOf(mp) % 2 === 0 ? styles.widgetRow : styles.widgetRowAlt;
            return (
                <div className={st} key={mp.id} >
                    <button
                        type="button"
                        style={{ float: 'right', marginTop: 4, marginRight: 4 }}
                        className={cx(
                            'btn',
                            'btn-primary',
                        )}
                        onClick={() => this.selectMachineProfile(mp)}
                    >
                        {i18n._('Select')}
                    </button>
                    <div >
                        <strong>{mp.name}</strong> ({mp.model})
                        <br />
                        <i>{mp.description}</i>
                    </div>
                </div>
            );
        });
    }

    render() {
        const { machineProfiles } = this.props;
        const {
            selectedMachineProfileId,
            selectedMachineCategory,
            searchText,
        } = this.state;

        const machineProfile = selectedMachineProfileId ?
            _.find(machineProfiles, { id: selectedMachineProfileId }) : null;

        const title = i18n._('Connect to a Machine');

        const groupedMPs = _.groupBy(machineProfiles || [], 'machineCategory');
        const srch = searchText.toLowerCase();
        const filteredMPs = _.filter(groupedMPs[selectedMachineCategory], (mp) => {
            return mp.name.toLowerCase().includes(srch) ||
                mp.model.toLowerCase().includes(srch) ||
                mp.description.toLowerCase().includes(srch);
        });

        return (
            <div>
                <div className={cx('form-group', styles.widgetHeader)}>
                    <div className="input-group input-group-sm" >
                        <h6>{title}</h6>
                        {!machineProfile && (
                            <div className="input-group-prepend input-group-btn">
                                {Object.keys(groupedMPs).map((ct) => {
                                    return (
                                        <button
                                            type="button"
                                            key={ct}
                                            className={cx(
                                                'btn',
                                                'btn-default',
                                                { 'btn-select': selectedMachineCategory === ct }
                                            )}
                                            onClick={() => {
                                                this.setState({ selectedMachineCategory: ct });
                                            }}
                                        >
                                            {ct === 'TDP' ? '3DP' : ct}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        {!machineProfile && (
                            <div className="input-group-prepend input-group-btn">
                                <Input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    style={{ marginLeft: 10, width: 'auto' }}
                                    placeholder="Search Machines..."
                                    value={searchText || ''}
                                    onChange={e => {
                                        this.setState({ searchText: e.target.value });
                                    }}
                                />
                            </div>
                        )}
                        {machineProfile && (
                            <div className="input-group-btn">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => this.selectMachineProfile(null)}
                                >
                                    {i18n._('Change Machine')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className={ cx(styles.widgetCenter, styles.customMachine) }>
                    {!machineProfiles && <center><i>Loading...</i></center>}
                    {machineProfiles && machineProfile && this.renderMachineProfile(machineProfile)}
                    {machineProfiles && !machineProfile && this.renderMachineProfiles(filteredMPs)}
                </div>
            </div>
        );
    }
}

export default ChooseMachine;
