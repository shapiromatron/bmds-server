import React, {Component} from "react";
import {Modal, Row, Col} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import {MODEL_NESTED_DICHOTOMOUS} from "../../constants/mainConstants";

import InfoTable from "./InfoTable";
import ModelOptionsTable from "./ModelOptionsTable";
import ParameterPriorTable from "./ParameterPriorTable";
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
import MaBenchmarkDose from "./MaBenchmarkDose";
import MaIndividualModels from "./MaIndividualModels";
import NestedDichotomousModalBody from "../Output/NestedDichotomous/ModalBody";

import * as dc from "../../constants/dataConstants";
import Button from "../common/Button";

@observer
class IndividualModelBody extends Component {
    render() {
        const {outputStore} = this.props,
            dataset = outputStore.selectedDataset,
            model = outputStore.modalModel,
            dtype = dataset.dtype;

        return (
            <Modal.Body>
                <Row>
                    <Col xs={4}>
                        <InfoTable />
                    </Col>
                    <Col xs={3}>
                        <ModelOptionsTable dtype={dtype} model={model} />
                    </Col>
                    <Col xs={5}>
                        <ParameterPriorTable priors={model.settings.priors} />
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
                        <ModelParameters parameters={model.results.parameters} />
                    </Col>
                    <Col xs={8}>
                        <DoseResponsePlot
                            layout={outputStore.drIndividualPlotLayout}
                            data={outputStore.drIndividualPlotData}
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
                {dtype != dc.Dtype.NESTED_DICHOTOMOUS ? (
                    <Row>
                        <Col xs={4} style={{maxHeight: "50vh", overflowY: "scroll"}}>
                            <CDFTable bmd_dist={model.results.fit.bmd_dist} />
                        </Col>
                        <Col xs={8}>
                            <CDFPlot dataset={dataset} cdf={model.results.fit.bmd_dist} />
                        </Col>
                    </Row>
                ) : null}
            </Modal.Body>
        );
    }
}
IndividualModelBody.propTypes = {
    outputStore: PropTypes.object,
};

@observer
class ModelAverageBody extends Component {
    render() {
        const {outputStore} = this.props,
            dataset = outputStore.selectedDataset,
            model = outputStore.modalModel,
            bayesian_models = outputStore.selectedOutput.bayesian.models;
        return (
            <Modal.Body>
                <Row>
                    <Col xs={3}>
                        <MaBenchmarkDose results={model.results} />
                    </Col>
                    <Col>
                        <DoseResponsePlot
                            layout={outputStore.drBayesianPlotLayout}
                            data={outputStore.drBayesianPlotData}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <MaIndividualModels model_average={model} models={bayesian_models} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={4} style={{maxHeight: "50vh", overflowY: "scroll"}}>
                        <CDFTable bmd_dist={model.results.bmd_dist} />
                    </Col>
                    <Col xs={8}>
                        <CDFPlot dataset={dataset} cdf={model.results.bmd_dist} />
                    </Col>
                </Row>
            </Modal.Body>
        );
    }
}
ModelAverageBody.propTypes = {
    outputStore: PropTypes.object,
};

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel,
            isMA = outputStore.drModelModalIsMA;

        if (!model) {
            return null;
        }

        const name = isMA ? "Model Average" : model.name,
            modelType = outputStore.getModelType,
            Body = isMA
                ? ModelAverageBody
                : modelType === MODEL_NESTED_DICHOTOMOUS
                ? NestedDichotomousModalBody
                : IndividualModelBody;

        return (
            <Modal
                show={outputStore.showModelModal}
                onHide={outputStore.closeModal}
                size="xl"
                centered>
                <Modal.Header>
                    <Modal.Title>{name}</Modal.Title>
                    <Button
                        id="close-modal"
                        className="btn btn-secondary float-right"
                        onClick={outputStore.closeModal}
                        faClass="fa fa-fw fa-times"
                    />
                </Modal.Header>
                <Body outputStore={outputStore} />
            </Modal>
        );
    }
}
ModelDetailModal.propTypes = {
    outputStore: PropTypes.object,
};
export default ModelDetailModal;
