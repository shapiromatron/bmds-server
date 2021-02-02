import React, {Component} from "react";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";
import ModelsReadOnly from "./ModelsReadOnly";
import {toJS} from "mobx";
import ModelsCheckBoxHeader from "./ModelsCheckBoxHeader";
import PropTypes from "prop-types";

@inject("modelsStore")
@observer
class ModelsCheckBoxList extends Component {
    render() {
        const {modelsStore} = this.props;
        let models = toJS(modelsStore.models),
            model_headers = toJS(modelsStore.model_headers);
        return (
            <div className="mt-2 text-center">
                {!(typeof models === "undefined") ? (
                    <table className="modelscheckbox table table-bordered table-sm">
                        <ModelsCheckBoxHeader
                            model_headers={model_headers}
                            isEditSettings={modelsStore.canEdit}
                            enableAll={modelsStore.enableAllModels}
                        />
                        {modelsStore.canEdit ? (
                            <ModelsCheckBox
                                models={models}
                                toggleModelsCheckBox={modelsStore.toggleModelsCheckBox}
                                savePriorWeight={modelsStore.savePriorWeight}
                                total_weight={modelsStore.total_weight}
                            />
                        ) : (
                            <ModelsReadOnly models={models} />
                        )}
                    </table>
                ) : null}
            </div>
        );
    }
}
ModelsCheckBoxList.propTypes = {
    modelsStore: PropTypes.object,
    toggleModelsCheckBox: PropTypes.func,
    models: PropTypes.array,
    model_headers: PropTypes.object,
    canEdit: PropTypes.bool,
    onChange: PropTypes.func,
};
export default ModelsCheckBoxList;
