import React, {Component} from "react";
import {Modal, Button, Form} from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class DataModal extends Component {
    constructor(props) {
        super(props);
    }

    toggleModal = () => {
        this.props.DataStore.toggleModal();
    };

    onChange = e => {
        this.props.DataStore.inputForm.model_type = e.target.value;
        this.props.DataStore.toggleModal();
    };
    render() {
        let model_type = this.props.DataStore.inputForm.model_type;
        return (
            <div>
                <Modal show={this.props.DataStore.modal} onHide={this.toggleModal}>
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {" "}
                            Add Dataset{" "}
                            <Button
                                className=" close"
                                aria-label="Close"
                                style={{float: "right"}}
                                onClick={() => this.toggleModal()}>
                                <span aria-hidden="true">&times;</span>
                            </Button>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Select Model Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={model_type}
                                    onChange={e => this.onChange(e)}>
                                    <option value="">Select a model</option>
                                    <option value="CS">Continuous - summarized</option>
                                    <option value="CI">Continuous - individual</option>
                                    <option value="D">Dichotomous</option>
                                    <option value="NS">Nested</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default DataModal;
