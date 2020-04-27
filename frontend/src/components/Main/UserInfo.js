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
        let model_type = event.target.modelType.value;
        this.props.DataStore.runAnalysis(model_type);
    };

    handleChange = e => {
        this.props.DataStore.addModelType(e.target.value);
    };

    render() {
        return (
            <div>
                <div className="col main-form" xs={4}>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Group>
                            <Form.Label>Analysis Name</Form.Label>
                            <Form.Control type="text" name="analysisName" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Analysis Description</Form.Label>
                            <Form.Control as="textarea" rows="3" name="analysisDescription" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Model Type</Form.Label>
                            <Form.Control as="select" name="modelType" onChange={this.handleChange}>
                                <option value="">Select Model Type</option>
                                <option value="C">Continuous</option>
                                <option value="D">Dichotomous</option>
                                <option value="DMT">Dichotomous-Multi-tumor(MS_Combo)</option>
                                <option value="DN">Dichotomous-Nested</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button>Load Analysis</Button>
                            <Button>Save Analysis</Button>
                            <Button type="submit">Run Analysis</Button>
                        </Form.Group>
                    </Form>
                </div>
            </div>
        );
    }
}

export default UserInfo;
