import React, {Component} from "react";
import {Table, Modal, Button, Row, Col, Form} from "react-bootstrap";

export class DataModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelType: "CS",
        };
    }

    handleSubmit = event => {
        event.preventDefault();
        console.log(event.target.modelType.value);
    };

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
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
                                <option value="N">Nested</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Button
                                style={{marginRight: "20px"}}
                                variant="primary"
                                type="submit"
                                onClick={this.props.onHide}>
                                Create Dataset
                            </Button>
                            <Button variant="primary" onClick={this.props.onHide}>
                                Close
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}
