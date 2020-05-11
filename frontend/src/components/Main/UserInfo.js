import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = e => {
        e.preventDefault();
        let model_type = e.target.modelType.value;
        let analysis_name = e.target.analysis_name.value;
        let analysis_description = e.target.analysis_description.value;
        this.props.DataStore.runAnalysis(model_type, analysis_name, analysis_description);
    };

    handleChange = e => {
        let model_type = e.target.value;
        this.props.DataStore.addModelType(model_type);
    };

    render() {
        let obj = this.props.DataStore.modelType;

        return (
            <Form onSubmit={this.handleSubmit} className="main-form">
                <Form.Group>
                    <Form.Label>Analysis Name</Form.Label>
                    <Form.Control type="text" name="analysis_name" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Analysis Description</Form.Label>
                    <Form.Control as="textarea" rows="3" name="analysis_description" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Select Model Type</Form.Label>
                    <Form.Control
                        as="select"
                        name="modelType"
                        onChange={this.handleChange}
                        value={obj}>
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
