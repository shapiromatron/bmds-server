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
import DoseResponsePlot from "../common/DoseResponsePlot";
import CSTestofInterest from "./CSTestofInterest";

import * as dc from "../../constants/dataConstants";

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props,
            output = outputStore.selectedOutput,
            dataset = output.dataset,
            model = outputStore.selectedModel;

        if (model === undefined) {
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
                    <Modal.Title id="contained-modal-title-vcenter">{model.name}</Modal.Title>
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
                    {dataset.model_type == dc.DATA_DICHOTOMOUS ? (
                        <Row>
                            <Col xs={12}>
                                <GoodnessFit store={outputStore} />
                            </Col>
                        </Row>
                    ) : null}
                    {dataset.model_type == dc.DATA_CONTINUOUS_SUMMARY ? (
                        <Row>
                            <Col xs={4}>
                                <CSLoglikelihoods results={model.results} />
                            </Col>
                            <Col xs={4}>
                                <CSTestofInterest results={model.results} />
                            </Col>
                        </Row>
                    ) : null}
                    <Row>
                        <Col xs={4}>
                            <CDFTable bmd_dist={model.results.fit.bmd_dist} />
                        </Col>
                        <Col>
                            <DoseResponsePlot
                                layout={outputStore.drPlotLayout}
                                data={outputStore.drPlotData}
                            />
                            <CDFPlot cdf={model.results.fit.bmd_dist} />
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
    selectedOutput: PropTypes.func,
    dataset: PropTypes.object,
    model_type: PropTypes.string,
};
export default ModelDetailModal;
