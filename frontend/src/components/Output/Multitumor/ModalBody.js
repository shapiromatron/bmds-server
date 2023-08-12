import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import {Modal} from "react-bootstrap";

import {ff} from "@/utils/formatters";

@observer
class ModalBody extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel,
            dataset = outputStore.modalDataset,
            isSummary = outputStore.drModelModalIsMA;

        return (
            <Modal.Body>
                <div>
                    <p>{isSummary ? "Summary" : "Individual"}</p>
                    {dataset ? <p>{dataset.metadata.name}</p> : null}
                    <p>Result: {ff(model.bmd)}</p>
                </div>
            </Modal.Body>
        );
    }
}
ModalBody.propTypes = {
    outputStore: PropTypes.object,
};
export default ModalBody;
