import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Modal, Row, Col} from "react-bootstrap";
import SelectInput from "../../common/SelectInput";
import {optionType} from "../../../constants/mainConstants";
import PropTypes from "prop-types";
import Button from "../../common/Button";

@inject("mainStore")
@observer
class ActionModal extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <Modal
                show={mainStore.showModal}
                onHide={() => mainStore.closeActionModal()}
                size="m"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">Download Report</Modal.Title>

                    <Button
                        className="btn btn-danger"
                        style={{float: "right"}}
                        onClick={() => mainStore.closeActionModal()}
                        faClass="fa fa-times"
                        hidden="true"
                    />
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <SelectInput
                                label="Select Option"
                                choices={optionType.map(option => {
                                    return {value: option.value, text: option.name};
                                })}
                                onChange={value => mainStore.updateSelectedModel(value)}
                                value={mainStore.selectedModel}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Button
                                className="btn btn-primary mr-2"
                                onClick={() => mainStore.downloadReport("wordUrl")}
                                text="Download Report"
                            />
                            <Button
                                id="close-modal"
                                className="btn btn-danger"
                                onClick={() => mainStore.closeActionModal()}
                                text="Cancel"
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }
}
ActionModal.propTypes = {
    mainStore: PropTypes.object,
};
export default ActionModal;
