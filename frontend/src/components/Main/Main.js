import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm/AnalysisForm";
import ModelsCheckBoxList from "./ModelsForm/ModelsCheckBoxList";
import OptionsFormList from "./OptionsForm/OptionsFormList";
import PropTypes from "prop-types";

import {inject, observer} from "mobx-react";
import DatasetModelOptionList from "./DatasetModelOptionList/DatasetModelOptionList";
import AnalysisFormReadOnly from "./AnalysisForm/AnalysisFormReadOnly";
import Button from "../common/Button";
import HelpText from "../common/HelpText";

@inject("mainStore")
@observer
class Main extends Component {
    render() {
        const {mainStore} = this.props,
            multiTumorMessage =
                "If multiple tumor datasets are evaluated, this tool will output individual and combined tumor risk estimates. The combined tumor risk estimates will only be relevant for tumors from the same study and the model assumes that the tumors develop independently, eg. one tumor does not progress to or influence the development of another.";
        return mainStore.isUpdateComplete ? (
            <div className="row">
                <div className="col-lg-4 analysis">
                    <div className="mb-2">
                        {mainStore.canEdit ? <AnalysisForm /> : <AnalysisFormReadOnly />}
                    </div>
                    <div>{mainStore.getDatasetLength ? <DatasetModelOptionList /> : null}</div>
                </div>
                <div className="col-lg-8">
                    {mainStore.canEdit & !mainStore.isMultiTumor ? (
                        <Button
                            className="btn btn-sm btn-warning"
                            onClick={mainStore.resetModelSelection}
                            text="Reset Model Selection"
                        />
                    ) : null}
                    {mainStore.isMultiTumor ? (
                        <HelpText content={multiTumorMessage} />
                    ) : (
                        <ModelsCheckBoxList />
                    )}
                    <OptionsFormList />
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
