import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.store.saveAnalysis();
    };

    handleChange = e => {
        this.props.store.addUsersInput(e.target.name, e.target.value);
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit} className="main-form">
                <Form.Group>
                    <Form.Label>Analysis Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="analysis_name"
                        value={this.props.store.usersInput.analysis_name}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Analysis Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows="3"
                        name="analysis_description"
                        value={this.props.store.usersInput.analysis_description}
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Select Model Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="dataset_type"
                        onChange={this.handleChange}
                        value={this.props.store.usersInput.dataset_type}>
                        <option value="select">Select Model Type</option>
                        <option value="C">Continuous</option>
                        <option value="D">Dichotomous</option>
                        <option value="DMT">Dichotomous-Multi-tumor(MS_Combo)</option>
                        <option value="DN">Dichotomous-Nested</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button>Load Analysis</Button>
                    <Button type="submit">Save Analysis</Button>
                    <Button disabled>Run Analysis</Button>
                </Form.Group>
            </Form>
        );
    }
}

export default UserInfo;
