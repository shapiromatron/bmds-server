import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import RunAnalysisService from "../Service/RunAnalysisService";
import ModelFilter from "../Filters/ModelFilter";
import OptionsFilter from "../Filters/OptionsFilter";
import DataFilter from "../Filters/DataFilter";

import {toJS} from "mobx";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.runAnalysisService = new RunAnalysisService();
        this.modelFilter = new ModelFilter();
        this.optionFilter = new OptionsFilter();
        this.dataFilter = new DataFilter();
    }

    handleSubmit = event => {
        event.preventDefault();
        let dataset_type = event.target.modelType.value;

        let models = toJS(this.props.DataStore.models);
        let model = this.modelFilter.filterModel(models);

        let options = toJS(this.props.DataStore.options);
        let option = this.optionFilter.filterOptions(options[0]);

        let datasets = toJS(this.props.DataStore.activeDataset);
        let data = this.dataFilter.filterData(datasets);

        let payload = {
            editKey: "fnvuzjigoa2w",
            data: {
                bmds_version: "BMDS312",
                dataset_type,
                models: model,
                datasets: data,
                options: option,
            },
        };

        this.runAnalysisService.runJob(payload);
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
                            <Form.Control as="select" name="modelType">
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
