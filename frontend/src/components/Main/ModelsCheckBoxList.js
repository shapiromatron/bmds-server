import React, {Component} from "react";
import * as ReactBootstrap from "react-bootstrap";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";

@inject("DataStore")
@observer
class ModelType extends Component {
    constructor(props) {
        super(props);
    }

    handleCheckbox = e => {
        let model = e.target.name;
        this.props.DataStore.toggleModelsCheckBox(model);
    };

    render() {
        let model_type = this.props.DataStore.modelType;
        let models = [];
        if (model_type == "C") {
            models = this.props.DataStore.CmodelType;
        } else if (model_type == "D") {
            models = this.props.DataStore.DmodelType;
        }

        return (
            <div>
                {this.props.DataStore.modelType ? (
                    <div>
                        <ReactBootstrap.Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th colSpan="2">MLE</th>
                                    <th colSpan="3">Alternatives</th>
                                </tr>

                                <tr>
                                    <th></th>
                                    <th>Frequentist Restricted</th>
                                    <th>Frequentist Unrestricted</th>
                                    <th>Bayesian</th>
                                    <th colSpan="2">Bayesian Model Average</th>
                                </tr>

                                <tr>
                                    <th>Model Name</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Enable</th>
                                    <th>Prior Weights</th>
                                </tr>
                            </thead>
                            <ModelsCheckBox models={models} onChange={this.handleCheckbox} />
                        </ReactBootstrap.Table>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ModelType;
