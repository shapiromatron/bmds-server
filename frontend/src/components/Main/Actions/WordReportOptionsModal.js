import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Modal, Row, Col, Form} from "react-bootstrap";
import PropTypes from "prop-types";

import Button from "../../common/Button";
import CheckboxInput from "../../common/CheckboxInput";

@inject("mainStore")
@observer
class WordReportOptionsModal extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <Modal
                show={mainStore.displayWordReportOptionModal}
                onHide={mainStore.closeWordReportOptionModal}
                size="xl"
                centered>
                <Modal.Header>
                    <Modal.Title>Download Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Form.Label column lg={2}>
                            Long Dataset Format
                        </Form.Label>
                        <Col>
                            <CheckboxInput
                                checked={mainStore.reportOptions.datasetFormat}
                                onChange={checked =>
                                    mainStore.changeReportOptions("datasetFormat", checked)
                                }
                            />
                            {/* <Form.Check
                                name="datasetFormat"
                                checked={mainStore.reportOptions.datasetFormat}
                                type='checkbox'
                                onChange={(e) => mainStore.changeReportOptions('datasetFormat', e.target.value)}
                            /> */}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            Model Output
                        </Form.Label>
                        <Col>
                            <CheckboxInput
                                checked={mainStore.reportOptions.modelOutput}
                                onChange={checked =>
                                    mainStore.changeReportOptions("modelOutput", checked)
                                }
                            />
                            {/* <Form.Check
                                name="modelOutput"
                                checked={mainStore.reportOptions.modelOutput}
                                type='checkbox'
                                onChange={checked => mainStore.changeReportOptions('modelOutput', checked)}
                            /> */}
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            CDF Table
                        </Form.Label>

                        <Col>
                            <CheckboxInput
                                checked={mainStore.reportOptions.cdfTable}
                                onChange={checked =>
                                    mainStore.changeReportOptions("cdfTable", checked)
                                }
                            />
                            {/* <Form.Check
                                name="cdfTable"
                                checked={mainStore.reportOptions.cdfTable}
                                type='checkbox'
                                onChange={(e) => mainStore.changeReportOptions('cdfTable', e.target.value)}
                            /> */}
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Button
                                className="btn btn-primary mr-2"
                                onClick={mainStore.submitWordReportRequest}
                                text={"Download Report"}
                            />
                            <Button
                                id="close-modal"
                                className="btn btn-secondary"
                                onClick={mainStore.closeWordReportOptionModal}
                                text={"Cancel"}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
WordReportOptionsModal.propTypes = {
    mainStore: PropTypes.object,
};
export default WordReportOptionsModal;
