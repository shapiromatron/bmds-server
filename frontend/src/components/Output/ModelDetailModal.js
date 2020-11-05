import React, {Component} from "react";
import {Modal, Row, Col} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import InfoTable from "./InfoTable";
import ModelOptionsTable from "./ModelOptionsTable";
import BenchmarkDose from "./BenchmarkDose";
import ModelData from "./ModelData";
import ModelParameters from "./ModelParameters";
import GoodnessFit from "./GoodnessFit";
import CDFTable from "./CDFTable";
import CDFPlot from "./CDFPlot";
import CSLoglikelihoods from "./CSLoglikelihoods";
import ResponsePlot from "./ResponsePlot";
import CSTestofInterest from "./CSTestofInterest";

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props;
        if (outputStore.selectedModel === undefined) {
            return null;
        }
        return (
            <Modal
                show={outputStore.modelDetailModal}
                onHide={() => outputStore.toggleModelDetailModal()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {" "}
                        {outputStore.selectedModel.model_name} - Details
                    </Modal.Title>
                    <button
                        className="btn btn-danger"
                        style={{float: "right"}}
                        onClick={() => outputStore.toggleModelDetailModal()}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col xs={4}>
                            <InfoTable />
                        </Col>
                        <Col xs={4}>
                            <ModelOptionsTable />
                        </Col>
                        <Col xs={4}>
                            <ModelData />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            <BenchmarkDose store={outputStore} />
                        </Col>
                        <Col xs={4}>
                            <ModelParameters store={outputStore} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <GoodnessFit store={outputStore} />
                        </Col>
                    </Row>
                    {outputStore.getCurrentOutput.dataset.model_type == "CS" ? (
                        <Row>
                            <Col xs={4}>
                                <CSLoglikelihoods />
                            </Col>
                            <Col xs={4}>
                                <CSTestofInterest />
                            </Col>
                        </Row>
                    ) : null}
                    <Row>
                        <Col xs={4}>
                            <CDFTable store={outputStore} />
                        </Col>
                        <Col>
                            <ResponsePlot />
                            <CDFPlot store={outputStore} />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
ModelDetailModal.propTypes = {
    outputStore: PropTypes.object,
    modelDetailModal: PropTypes.bool,
    toggleModelDetailModal: PropTypes.func,
    selectedModel: PropTypes.object,
    model_name: PropTypes.string,
    getCurrentOutput: PropTypes.func,
    dataset: PropTypes.object,
    model_type: PropTypes.string,
};
export default ModelDetailModal;
