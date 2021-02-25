import React, {Component} from "react";
import {Modal, Row, Col} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import InfoTable from "./InfoTable";
import ModelOptionsTable from "./ModelOptionsTable";
import ModelData from "./ModelData";
import ModelParameters from "./ModelParameters";
import GoodnessFit from "./GoodnessFit";
import CDFTable from "./CDFTable";
import CDFPlot from "./CDFPlot";
import DoseResponsePlot from "../common/DoseResponsePlot";
import CSTestofInterest from "./CSTestofInterest";
import DichotomousSummary from "./DichotomousSummary";
import DichotomousDeviance from "./DichotomousDeviance";
import ContinuousSummary from "./ContinuousSummary";
import ContinuousDeviance from "./ContinuousDeviance";

import * as dc from "../../constants/dataConstants";

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props,
            output = outputStore.selectedOutput,
            dataset = output.dataset,
            model = outputStore.modalModel,
            dtype = dataset.dtype;

        if (!model) {
            return null;
        }

        return (
            <Modal
                show={outputStore.showModelModal}
                onHide={() => outputStore.closeModal()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">{model.name}</Modal.Title>
                    <button
                        className="btn btn-danger"
                        style={{float: "right"}}
                        onClick={() => outputStore.closeModal()}>
                        <i className="fa fa-times" aria-hidden="true"></i>
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <Row>
                        <Col xs={4}>
                            <InfoTable />
                        </Col>
                        <Col xs={4}>
                            <ModelOptionsTable dtype={dtype} model={model} />
                        </Col>
                        <Col xs={4}>
                            <ModelData dtype={dtype} dataset={dataset} />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4}>
                            {dtype == dc.Dtype.DICHOTOMOUS ? (
                                <DichotomousSummary store={outputStore} />
                            ) : null}
                            {dtype == dc.Dtype.CONTINUOUS ? (
                                <ContinuousSummary store={outputStore} />
                            ) : null}
                            <ModelParameters store={outputStore} />
                        </Col>
                        <Col xs={8}>
                            <DoseResponsePlot
                                layout={outputStore.drPlotLayout}
                                data={outputStore.drPlotModalData}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <GoodnessFit store={outputStore} />
                        </Col>
                    </Row>
                    {dtype == dc.Dtype.DICHOTOMOUS ? (
                        <Row>
                            <Col xs={12}>
                                <DichotomousDeviance store={outputStore} />
                            </Col>
                        </Row>
                    ) : null}
                    {dtype == dc.Dtype.CONTINUOUS ? (
                        <Row>
                            <Col xs={12}>
                                <ContinuousDeviance store={outputStore} />
                                <CSTestofInterest store={outputStore} />
                            </Col>
                        </Row>
                    ) : null}
                    <Row>
                        <Col xs={4} style={{maxHeight: "50vh", overflowY: "scroll"}}>
                            <CDFTable bmd_dist={model.results.fit.bmd_dist} />
                        </Col>
                        <Col xs={8}>
                            <CDFPlot dataset={dataset} cdf={model.results.fit.bmd_dist} />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
ModelDetailModal.propTypes = {
    outputStore: PropTypes.object,
};
export default ModelDetailModal;
