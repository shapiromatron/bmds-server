import React, {Component} from "react";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";
import ModelsReadOnly from "./ModelsReadOnly";
import {toJS} from "mobx";

@inject("mainStore")
@observer
class ModelsCheckBoxList extends Component {
    render() {
        const {mainStore} = this.props,
            handleCheckbox = e => {
                let model_name = e.target.name;
                let checked = e.target.checked;
                let value = e.target.value;
                mainStore.toggleModelsCheckBox(model_name, checked, value);
            },
            models = toJS(mainStore.getModelTypeList()),
            modelsHeaders = mainStore.getmodelsHeaders(),
            isEditSettings = mainStore.getEditSettings();
        return (
            <div>
                {models.length ? (
                    <table className="modelscheckbox table table-bordered table-sm">
                        <thead className="table-primary">
                            {Object.keys(modelsHeaders).map((item, index) => {
                                return [
                                    <tr key={index}>
                                        <th>{modelsHeaders[item].model}</th>
                                        {modelsHeaders[item].values.map((dev, index) => {
                                            return [
                                                <th key={index} colSpan={dev.colspan}>
                                                    {dev.name}{" "}
                                                    {(dev.name === "Enable") & isEditSettings ? (
                                                        <input
                                                            type="checkbox"
                                                            name={dev.model_name + "-All"}
                                                            onChange={handleCheckbox}
                                                            checked={dev.isChecked}
                                                        />
                                                    ) : null}
                                                    &emsp;
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
                        {isEditSettings ? (
                            <ModelsCheckBox models={models} onChange={handleCheckbox} />
                        ) : (
                            <ModelsReadOnly models={models} />
                        )}
                    </table>
                ) : null}
            </div>
        );
    }
}

export default ModelsCheckBoxList;
