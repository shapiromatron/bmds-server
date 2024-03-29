import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import ModelsCheckBox from "./ModelsCheckBox";
import ModelsCheckBoxHeader from "./ModelsCheckBoxHeader";

@inject("modelsStore")
@observer
class ModelsCheckBoxList extends Component {
    render() {
        const {modelsStore} = this.props;
        let models = modelsStore.models;
        return (
            <div className="mt-2 text-center">
                {!(typeof models === "undefined") ? (
                    <table className="table table-sm table-bordered">
                        <ModelsCheckBoxHeader store={modelsStore} />
                        <ModelsCheckBox store={modelsStore} />
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
