import React, {Component} from "react";
import * as ReactBootstrap from "react-bootstrap";

import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class ModelType extends Component {
    constructor(props) {
        super(props);
    }

    handleCheckbox(e) {
        let modelType = e.target.name;
        if (e.target.checked) {
            this.props.DataStore.addModelTypes(modelType);
        } else {
            this.props.DataStore.deleteModelType(modelType);
        }
    }

    render() {
        return (
            <div>
                {this.props.DataStore.modelType.length > 0 ? (
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
                            <tbody>
                                <tr>
                                    <td>Exponential</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_restricted-Exponential"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_unrestricted-Exponential "
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian-Exponential"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian_model_average-Exponential"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Hill</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_restricted-Hill"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_unrestricted-Hill"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian-Hill"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian_model_average-Hill"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Linear</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_restricted-Linear"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_unrestricted-Linear"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian-Linear"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian_model_average-Linear"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Polynomial</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_restricted-Polynomial"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_unrestricted-Polynomial"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian-Polynomial"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian_model_average-Polynomial"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Power</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_restricted-Power"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="frequentist_unrestricted-Power"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian-Power"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            name="bayesian_model_average-Power"
                                            onChange={e => this.handleCheckbox(e)}
                                        />
                                    </td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total Weights</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </ReactBootstrap.Table>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ModelType;
