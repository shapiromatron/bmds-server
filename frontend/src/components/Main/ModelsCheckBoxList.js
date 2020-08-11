import React, {Component} from "react";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";
import ModelsReadOnly from "./ModelsReadOnly";
import {toJS} from "mobx";
import ModelsCheckBoxHeader from "./ModelsCheckBoxHeader";

@inject("modelsStore")
@observer
class ModelsCheckBoxList extends Component {
    render() {
        const {modelsStore} = this.props,
            handleCheckbox = e => {
                let model_name = e.target.name;
                let checked = e.target.checked;
                let value = e.target.value;
                modelsStore.toggleModelsCheckBox(model_name, checked, value);
            },
            isEditSettings = modelsStore.getEditSettings();
        let dataset_type = modelsStore.dataset_type;
        modelsStore.getModelsList(dataset_type);
        let models = toJS(modelsStore.models);
        let modelsHeaders = modelsStore.getmodelsHeaders();
        return (
            <div>
                <table className="modelscheckbox table table-bordered table-sm">
                    <ModelsCheckBoxHeader
                        model_headers={modelsHeaders}
                        isEditSettings={isEditSettings}
                        onChange={handleCheckbox}
                    />
                    {isEditSettings ? (
                        <ModelsCheckBox models={models} onChange={handleCheckbox} />
                    ) : (
                        <ModelsReadOnly models={models} />
                    )}
                </table>
            </div>
        );
    }
}

export default ModelsCheckBoxList;
