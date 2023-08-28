import {toJS} from "mobx";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {Col, Modal, Row} from "react-bootstrap";

import {ff} from "@/utils/formatters";

import AnalysisOfDeviance from "./AnalysisOfDeviance";
import Doses from "./Doses";
import GoodnessOfFit from "./GoodnessOfFit";
import ModelParameters from "./ModelParameters";
import ParameterSettings from "./ParameterSettings";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel,
            dataset = outputStore.modalDataset,
            isSummary = outputStore.drModelModalIsMA;
        // console.log(toJS(dataset));
        // console.log(toJS(model));

        return (
            <Modal.Body>
                <Row>
                    <Col>
                        <h1>{isSummary ? "Summary" : "Individual"}</h1>
                        {dataset ? <p>{dataset.metadata.name}</p> : null}
                        <p>Result: {ff(model.bmd)}</p>/ dose
                        <h2>multistage 3 degree</h2>
                        <p>summary</p>
                    </Col>
                    <Col>
                        <Doses model={dataset} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p>input summary</p>
                    </Col>
                    <Col>
                        <ParameterSettings model={dataset} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ModelParameters model={dataset} />
                    </Col>
                    <Col>
                        <GoodnessOfFit model={dataset} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AnalysisOfDeviance model={dataset} />
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
