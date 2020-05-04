import React, {Component} from "react";
import {Modal, Button, Form} from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class DataModal extends Component {
    constructor(props) {
        super(props);
    }

    hideModal() {
        this.props.DataStore.closeModal();
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.DataStore.showDataForm(event.target.modelType.value);
        this.props.DataStore.closeModal();
    };
    render() {
        return (
            <div>
                <Modal show={this.props.DataStore.modal}>
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title-vcenter"> Add Dataset </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group>
                                <Form.Label>Select Model Type</Form.Label>
                                <Form.Control as="select" name="modelType">
                                    <option value="CS">Continuous - summarized</option>
                                    <option value="CI">Continuous - individual</option>
                                    <option value="D">Dichotomous</option>
                                    <option value="NS">Nested</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Button
                                    style={{marginRight: "20px"}}
                                    variant="primary"
                                    type="submit">
                                    Create Dataset
                                </Button>
                                <Button variant="primary" onClick={() => this.hideModal()}>
                                    Close
                                </Button>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default DataModal;
