import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {Col, Modal, Row} from "react-bootstrap";

import ModelParameters from "../../IndividualModel/ModelParameters";
import AnalysisOfDeviance from "./AnalysisOfDeviance";
import Doses from "./Doses";
import GoodnessFit from "./GoodnessFit";
import InfoTable from "./InfoTable";
import ModelOptions from "./ModelOptions";
import {MsComboInfo, MsComboSummary} from "./MsCombo";
import ParameterSettings from "./ParameterSettings";
import Summary from "./Summary";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            {selectedModelOptions} = outputStore,
            model = outputStore.modalModel,
            isSummary = outputStore.drModelModalIsMA,
            dataset = outputStore.modalDataset;

        if (isSummary) {
            return (
                <Modal.Body>
                    <Row>
                        <Col xl={6}>
                            <MsComboInfo options={selectedModelOptions} />
                        </Col>
                        <Col xl={6}>
                            <MsComboSummary results={model} />
                        </Col>
                    </Row>
                </Modal.Body>
            );
        }
        return (
            <Modal.Body>
                <Row>
                    <Col xl={4}>
                        <InfoTable />
                    </Col>
                    <Col xl={4}>
                        <ModelOptions model={model} />
                    </Col>
                    <Col xl={4}>
                        <Doses model={dataset} />
                    </Col>
                    <Col xl={6}>
                        <Summary model={model} />
                    </Col>
                    <Col xl={6}>PLOT</Col>
                    <Col xl={6}>
                        <ParameterSettings model={model} />
                    </Col>
                    <Col xl={6}>
                        <ModelParameters parameters={model.parameters} />
                    </Col>
                    <Col xl={6}>
                        <GoodnessFit store={outputStore} />
                    </Col>
                    <Col xl={6}>
                        <AnalysisOfDeviance model={model} />
                    </Col>
                </Row>
            </Modal.Body>
        );
    }
}
ModalBody.propTypes = {
    outputStore: PropTypes.object,
};
export default ModalBody;
