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
import ContinuousTestOfInterest from "./ContinuousTestOfInterest";
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
class ModelBody extends Component {
    render() {
        const {outputStore} = this.props,
            dataset = outputStore.selectedDataset,
            model = outputStore.modalModel,
            dtype = dataset.dtype,
            priorClass = model.settings.priors.prior_class;

        return (
            <Modal.Body>
                <Row>
                    <Col xl={4}>
                        <InfoTable />
                    </Col>
                    <Col xl={3}>
                        <ModelOptionsTable dtype={dtype} model={model} />
                    </Col>
                    <Col xl={5}>
                        <ParameterPriorTable
                            parameters={model.results.parameters}
                            priorClass={priorClass}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xl={4}>
                        {dtype == dc.Dtype.DICHOTOMOUS ? (
                            <DichotomousSummary store={outputStore} />
                        ) : null}
                        {dtype == dc.Dtype.CONTINUOUS || dtype == dc.Dtype.CONTINUOUS_INDIVIDUAL ? (
                            <ContinuousSummary store={outputStore} />
                        ) : null}
                    </Col>
                    <Col xl={8}>
                        <DoseResponsePlot
                            layout={outputStore.drIndividualPlotLayout}
                            data={outputStore.drIndividualPlotData}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xl={8}>
                        <ModelParameters parameters={model.results.parameters} />
                    </Col>
                </Row>
                <Row>
                    <Col xl={8}>
                        <GoodnessFit store={outputStore} />
                    </Col>
                </Row>
                {dtype == dc.Dtype.DICHOTOMOUS ? (
                    <Row>
                        <Col xl={8}>
                            <DichotomousDeviance store={outputStore} />
                        </Col>
                    </Row>
                ) : null}
                {dtype == dc.Dtype.CONTINUOUS ? (
                    <Row>
                        <Col xl={12}>
                            <ContinuousDeviance store={outputStore} />
                            <ContinuousTestOfInterest store={outputStore} />
                        </Col>
                    </Row>
                ) : null}
                <Row>
                    <Col xl={4} style={{maxHeight: "50vh", overflowY: "scroll"}}>
                        <CDFTable bmd_dist={model.results.fit.bmd_dist} />
                    </Col>
                    <Col xl={8}>
                        <CDFPlot dataset={dataset} cdf={model.results.fit.bmd_dist} />
                    </Col>
                </Row>
            </Modal.Body>
        );
    }
}
ModelBody.propTypes = {
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
                    <Col xl={3}>
                        <MaBenchmarkDose results={model.results} />
                    </Col>
                    <Col xl={9}>
                        <DoseResponsePlot
                            layout={outputStore.drBayesianPlotLayout}
                            data={outputStore.drBayesianPlotData}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xl={12}>
                        <MaIndividualModels model_average={model} models={bayesian_models} />
                    </Col>
                </Row>
                <Row>
                    <Col xl={4} style={{maxHeight: "50vh", overflowY: "scroll"}}>
                        <CDFTable bmd_dist={model.results.bmd_dist} />
                    </Col>
                    <Col xl={8}>
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
                : ModelBody;

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
