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
                                checked={mainStore.wordReportOptions.datasetFormatLong}
                                onChange={checked =>
                                    mainStore.changeReportOptions("datasetFormatLong", checked)
                                }
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            Model Output
                        </Form.Label>
                        <Col>
                            <CheckboxInput
                                checked={mainStore.wordReportOptions.verboseModelOutput}
                                onChange={checked =>
                                    mainStore.changeReportOptions("verboseModelOutput", checked)
                                }
                            />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Form.Label column lg={2}>
                            CDF Table
                        </Form.Label>

                        <Col>
                            <CheckboxInput
                                checked={mainStore.wordReportOptions.bmdCdfTable}
                                onChange={checked =>
                                    mainStore.changeReportOptions("bmdCdfTable", checked)
                                }
                            />
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
