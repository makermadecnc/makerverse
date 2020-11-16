import _get from 'lodash/get';
import chainedFunction from 'chained-function';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Anchor from 'components/Anchor';
import { Button } from 'components/Buttons';
import FormGroup from 'components/FormGroup';
import { FlexContainer, Row, Col } from 'components/GridSystem';
import Modal from 'components/Modal';
import ModalTemplate from 'components/ModalTemplate';
import { Space } from 'components/';
import Table from 'components/Table';
import { TablePagination } from 'components/Paginations';
import portal from 'lib/portal';
import i18n from 'lib/i18n';
import {
    MODAL_UPDATE_RECORD
} from './constants';
import styles from './index.styl';
import AxisGrid from './AxisGrid';

class TableRecords extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    render() {
        const { state, actions } = this.props;

        return (
            <Table
                bordered={false}
                justified={false}
                data={(state.api.err || state.api.fetching) ? [] : state.records}
                rowKey={(record) => {
                    return record.id;
                }}
                emptyText={() => {
                    if (state.api.err) {
                        return (
                            <span className="text-danger">
                                {i18n._('An unexpected error has occurred.')}
                            </span>
                        );
                    }

                    if (state.api.fetching) {
                        return (
                            <span>
                                <i className="fa fa-fw fa-spin fa-circle-o-notch" />
                                <Space width="8" />
                                {i18n._('Loading...')}
                            </span>
                        );
                    }

                    return i18n._('No data to display');
                }}
                title={() => (
                    <div className={styles.tableToolbar}>
                        <TablePagination
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0
                            }}
                            page={state.pagination.page}
                            pageLength={state.pagination.pageLength}
                            totalRecords={state.pagination.totalRecords}
                            onPageChange={({ page, pageLength }) => {
                                actions.fetchRecords({ page, pageLength });
                            }}
                            prevPageRenderer={() => <i className="fa fa-angle-left" />}
                            nextPageRenderer={() => <i className="fa fa-angle-right" />}
                        />
                    </div>
                )}
                columns={[
                    {
                        title: i18n._('Name'),
                        key: 'name',
                        render: (value, row, index) => {
                            const { name } = row;

                            return (
                                <Anchor
                                    onClick={(event) => {
                                        actions.openModal(MODAL_UPDATE_RECORD, row);
                                    }}
                                >
                                    {name}
                                </Anchor>
                            );
                        }
                    },
                    {
                        title: i18n._('Controller'),
                        key: 'controller',
                        render: (value, row, index) => {
                            return (
                                <FlexContainer fluid gutterWidth={0}>
                                    <Row>
                                        <Col width="auto">
                                            <div>
                                                {`Type = ${_get(row, 'controller.controllerType')}`}
                                            </div>
                                            <div>
                                                {`Port = ${_get(row, 'controller.port')}`}
                                            </div>
                                            <div>
                                                {`Baud Rate = ${_get(row, 'controller.baudRate')}`}
                                            </div>
                                        </Col>
                                    </Row>
                                </FlexContainer>
                            );
                        }
                    },
                    {
                        title: 'X',
                        key: 'x',
                        render: (value, row, index) => <AxisGrid name="X" axis={row.axes.x} />,
                    },
                    {
                        title: 'Y',
                        key: 'y',
                        render: (value, row, index) => <AxisGrid name="Y" axis={row.axes.y} />,
                    },
                    {
                        title: 'Z',
                        key: 'z',
                        render: (value, row, index) => <AxisGrid name="Z" axis={row.axes.z} />,
                    },
                    {
                        title: i18n._('Action'),
                        className: 'text-nowrap',
                        key: 'action',
                        render: (value, row, index) => {
                            return (
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-default"
                                        title={i18n._('Update')}
                                        onClick={(event) => {
                                            actions.openModal(MODAL_UPDATE_RECORD, row);
                                        }}
                                    >
                                        <i className="fa fa-fw fa-edit" />
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-default"
                                        title={i18n._('Delete')}
                                        onClick={(event) => {
                                            portal(({ onClose }) => (
                                                <Modal disableOverlay onClose={onClose}>
                                                    <Modal.Body>
                                                        <ModalTemplate type="warning">
                                                            <FormGroup>
                                                                <strong>{i18n._('Delete Workspace')}</strong>
                                                            </FormGroup>
                                                            <div>
                                                                {row.name}
                                                            </div>
                                                        </ModalTemplate>
                                                    </Modal.Body>
                                                    <Modal.Footer>
                                                        <Button
                                                            onClick={onClose}
                                                        >
                                                            {i18n._('Cancel')}
                                                        </Button>
                                                        <Button
                                                            btnStyle="primary"
                                                            onClick={chainedFunction(
                                                                () => {
                                                                    actions.deleteRecord(row.id);
                                                                },
                                                                onClose
                                                            )}
                                                        >
                                                            {i18n._('OK')}
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                            ));
                                        }}
                                    >
                                        <i className="fa fa-fw fa-trash" />
                                    </button>
                                </div>
                            );
                        }
                    }
                ]}
            />
        );
    }
}

export default TableRecords;
