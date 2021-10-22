import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Modal, Row, Col} from "react-bootstrap";
import PropTypes from "prop-types";

import Button from "../../common/Button";

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
                        <Col>
                            <p className="text-muted">Placeholder for report configuration...</p>
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
