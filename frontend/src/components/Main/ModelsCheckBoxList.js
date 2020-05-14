import React, {Component} from "react";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";
import {toJS} from "mobx";

@inject("DataStore")
@observer
class ModelsCheckBoxList extends Component {
    constructor(props) {
        super(props);
    }

    handleCheckbox = e => {
        let model_name = e.target.name;
        let checked = e.target.checked;
        let value = e.target.value;
        this.props.DataStore.toggleModelsCheckBox(model_name, checked, value);
    };

    render() {
        let models = toJS(this.props.DataStore.getModelTypeList());
        return (
            <div>
                <div className="checkbox-table">
                    <table className="table table-bordered hover">
                        <thead>
                            {this.props.DataStore.modelsCheckBoxHeaders.map((item, index) => {
                                return [
                                    <tr key={index}>
                                        <th>{item.model}</th>
                                        {item.values.map((dev, index) => {
                                            return [
                                                <th key={index} colSpan={dev.colspan}>
                                                    {dev.name}{" "}
                                                    {dev.name === "Enable" ? (
                                                        <input
                                                            type="checkbox"
                                                            name={dev.model_name + "-All"}
                                                            onChange={this.handleCheckbox}
                                                        />
                                                    ) : null}
                                                    &nbsp; &nbsp;
                                                    {dev.model_name === "bayesian_model_average"
                                                        ? dev.prior_weight
                                                        : null}
                                                </th>,
                                            ];
                                        })}
                                    </tr>,
                                ];
                            })}
                        </thead>
                        <ModelsCheckBox models={models} onChange={this.handleCheckbox} />
                    </table>
                </div>
            </div>
        );
    }
}

export default ModelsCheckBoxList;
