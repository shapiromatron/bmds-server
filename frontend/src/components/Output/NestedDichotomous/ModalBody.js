import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {Col, Modal, Row} from "react-bootstrap";

import InfoTable from "../../IndividualModel/InfoTable";
import ModelOptionsTable from "../../IndividualModel/ModelOptionsTable";
import BootstrapResults from "./BootstrapResults";
import BootstrapRuns from "./BootstrapRuns";
import LitterData from "./LitterData";
import ModelParameters from "./ModelParameters";
import ScaledResidual from "./ScaledResidual";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            dataset = outputStore.selectedDataset,
            dtype = dataset.dtype,
            model = outputStore.modalModel;

        return (
            <Modal.Body>
                <Row>
                    <Col xs={6}>
                        <InfoTable />
                    </Col>
                    <Col xs={6}>
                        <ModelOptionsTable dtype={dtype} model={model} />
                    </Col>
                    <Col xs={6}>
                        <p>Summary table</p>
                    </Col>
                    <Col xs={6}>
                        <p>Plot!</p>
                    </Col>
                    <Col xs={6}>
                        <BootstrapResults model={model} />
                    </Col>
                    <Col xs={6}>
                        <BootstrapRuns model={model} />
                    </Col>
                    <Col xs={6}>
                        <ModelParameters model={model} />
                    </Col>
                    <Col xs={6}>
                        <ScaledResidual model={model} />
                    </Col>
                    <Col xs={12}>
                        <LitterData model={model} />
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
