import React, {Component} from "react";
import {Modal, Row, Col} from "react-bootstrap";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import BootstrapResults from "./BootstrapResults";
import BootstrapRuns from "./BootstrapRuns";
import ScaledResidual from "./ScaledResidual";
import LitterData from "./LitterData";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel;

        return (
            <Modal.Body>
                <Row>
                    <Col>
                        <p>Once we have real data...</p>
                        <p>Borrow user info (info, model options, model data) from other modal</p>
                        <p>Borrow benchmark dose, model parameters, from other model</p>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <BootstrapResults model={model} />
                    </Col>
                    <Col xs={6}>
                        <BootstrapRuns model={model} />
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>
                        <ScaledResidual model={model} />
                    </Col>
                </Row>
                <Row>
                    <Col>
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
