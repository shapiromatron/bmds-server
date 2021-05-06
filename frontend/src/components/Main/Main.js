import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm/AnalysisForm";
import ModelsCheckBoxList from "./ModelsForm/ModelsCheckBoxList";
import OptionsFormList from "./OptionsForm/OptionsFormList";
import PropTypes from "prop-types";

import {inject, observer} from "mobx-react";
import DatasetModelOptionList from "./DatasetModelOptionList/DatasetModelOptionList";
import AnalysisFormReadOnly from "./AnalysisForm/AnalysisFormReadOnly";

@inject("mainStore")
@observer
class Main extends Component {
    render() {
        const {mainStore} = this.props;
        return mainStore.isUpdateComplete ? (
            <div className="row">
                <div className="col-lg-4 analysis">
                    <div className="mb-2">
                        {mainStore.canEdit ? <AnalysisForm /> : <AnalysisFormReadOnly />}
                    </div>
                    <div>{mainStore.getDatasetLength ? <DatasetModelOptionList /> : null}</div>
                </div>
                <div className="col-lg-8">
                    <div>
                        <button
                            className="btn btn-sm btn-warning mr-auto"
                            onClick={e => mainStore.resetModelSelection()}>
                            Reset Model Selection
                        </button>
                        <ModelsCheckBoxList />
                    </div>
                    <div>
                        <OptionsFormList />
                    </div>
                </div>
            </div>
        ) : null;
    }
}
Main.propTypes = {
    mainStore: PropTypes.object,
    isUpdateComplete: PropTypes.bool,
};
export default Main;
