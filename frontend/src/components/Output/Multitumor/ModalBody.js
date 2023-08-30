import {toJS} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {Col, Modal, Row} from "react-bootstrap";

import {ff} from "@/utils/formatters";

import ModelParameters from "../../IndividualModel/ModelParameters";
import AnalysisOfDeviance from "./AnalysisOfDeviance";
import Doses from "./Doses";
import GoodnessFit from "./GoodnessFit";
import InfoTable from "./InfoTable";
import ModelOptions from "./ModelOptions";
import ParameterSettings from "./ParameterSettings";
import Summary from "./Summary";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel,
            isSummary = outputStore.drModelModalIsMA,
            dataset = outputStore.modalDataset;
        console.log(toJS(dataset));
        console.log(toJS(model));

        return (
            <Modal.Body>
                <Row>
                    <Col xl={3}>
                        <InfoTable />
                    </Col>
                    <Col xl={3}>{!isSummary && <ModelOptions model={model} />}</Col>
                    <Col xl={3}>{!isSummary && <Doses model={dataset} />}</Col>
                </Row>
                <Row>
                    <Col xl={4}>
                        <Summary model={model} />
                    </Col>
                    <Col xl={5}>
                        <ParameterSettings model={model} />
                    </Col>
                </Row>
                <Row>
                    <Col xl={9}>
                        {!isSummary && <ModelParameters parameters={model.parameters} />}
                    </Col>
                </Row>
                <Row>
                    <Col xl={9}>{!isSummary && <GoodnessFit store={outputStore} />}</Col>
                </Row>
                {!isSummary && (
                    <Row>
                        <Col xl={9}>{!isSummary && <AnalysisOfDeviance model={model} />}</Col>
                    </Row>
                )}
            </Modal.Body>
        );
    }
}
ModalBody.propTypes = {
    outputStore: PropTypes.object,
};
export default ModalBody;
