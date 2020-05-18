import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class UserInfo extends Component {
    render() {
        const {store} = this.props,
            handleSubmit = e => {
                e.preventDefault();
                store.saveAnalysis();
            },
            handleChange = e => {
                store.addUsersInput(e.target.name, e.target.value);
            };

        return (
            <Form onSubmit={handleSubmit} className="main-form">
                <Form.Group>
                    <Form.Label>Analysis Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="analysis_name"
                        value={store.usersInput.analysis_name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Analysis Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows="3"
                        name="analysis_description"
                        value={store.usersInput.analysis_description}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Select Model Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="dataset_type"
                        onChange={handleChange}
                        value={store.usersInput.dataset_type}>
                        <option value="C">Continuous</option>
                        <option value="D">Dichotomous</option>
                        <option value="DMT">Dichotomous-Multi-tumor (MS_Combo)</option>
                        <option value="DN">Dichotomous-Nested</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Button>Load Analysis</Button>
                    <Button type="submit">Save Analysis</Button>
                    <Button
                        disabled={!store.isReadyToExecute}
                        onClick={() => store.executeAnalysis()}>
                        Run Analysis
                    </Button>
                </Form.Group>
                {store.isExecuting ? <p>Executing... please wait....</p> : null}
            </Form>
        );
    }
}

export default UserInfo;
