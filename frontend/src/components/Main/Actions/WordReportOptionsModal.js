import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Modal, Row, Col } from "react-bootstrap";
import SelectInput from "../../common/SelectInput";
import { modelOptions } from "../../../constants/mainConstants";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class WordReportOptionsModal extends Component {
    render() {
        const { mainStore } = this.props;
        return (
            <>
                <Modal show={mainStore.showWordReportOptionModal} >
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">Download Report</Modal.Title>
                        <button
                            id="close-modal"
                            className="btn btn-danger float-right"
                            onClick={() => mainStore.closeActionModal()}>
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <SelectInput
                                    label="Select Option"
                                    choices={modelOptions.map(option => {
                                        return { value: option.value, text: option.name };
                                    })}
                                    onChange={value => mainStore.updateSelectedModel(value)}
                                    value={mainStore.selectedModel}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <button
                                    id="close-modal"
                                    className="btn btn-primary mr-2"
                                    onClick={() => mainStore.downloadReport('wordUrl')}>
                                    Download Report
                                </button>
                                <button
                                    id="close-modal"
                                    className="btn btn-danger"
                                    onClick={() => mainStore.closeActionModal()}>
                                    Cancel
                                </button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal >
            </>
        );
    }
}
WordReportOptionsModal.propTypes = {
    mainStore: PropTypes.object,
};
export default WordReportOptionsModal;