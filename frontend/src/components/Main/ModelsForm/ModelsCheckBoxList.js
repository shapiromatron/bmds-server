import React, {Component} from "react";

import {inject, observer} from "mobx-react";
import ModelsCheckBox from "./ModelsCheckBox";
import ModelsCheckBoxHeader from "./ModelsCheckBoxHeader";
import PropTypes from "prop-types";

@inject("modelsStore")
@observer
class ModelsCheckBoxList extends Component {
    componentDidMount() {
        this.props.modelsStore.setDefaultsByDatasetType();
    }

    render() {
        const {modelsStore} = this.props;
        let models = modelsStore.models;
        return (
            <div className="mt-2 text-center">
                {!(typeof models === "undefined") ? (
                    <table className="modelscheckbox table table-bordered table-sm">
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
