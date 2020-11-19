import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm/AnalysisForm";
import ModelsCheckBoxList from "./ModelsForm/ModelsCheckBoxList";
import OptionsFormList from "./OptionsForm/OptionsFormList";
import PropTypes from "prop-types";
import "./main.css";

import {inject, observer} from "mobx-react";
import DatasetList from "./DatasetList/DatasetList";
import AnalysisFormReadOnly from "./AnalysisForm/AnalysisFormReadOnly";

@inject("mainStore")
@observer
class Main extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                {mainStore.isUpdateComplete ? (
                    <div>
                        <div className="row">
                            <div className="col-lg-4 analysis">
                                {mainStore.getEditSettings ? (
                                    <AnalysisForm />
                                ) : (
                                    <AnalysisFormReadOnly />
                                )}
                            </div>
                            <div className="col-lg-8">
                                <div className="modelsCheckbox">
                                    <ModelsCheckBoxList />
                                </div>
                                <div className="optionslist">
                                    <OptionsFormList />
                                </div>
                            </div>
                        </div>
                        <div className="row second-row">
                            <div className="col-lg-4">
                                <div className="datasetlist">
                                    {mainStore.getDatasetLength ? <DatasetList /> : null}
                                </div>
                            </div>
                        </div>
                        <div
                            name="payload"
                            style={{color: "white", height: "1px", overflow: "hidden"}}>
                            {JSON.stringify(mainStore.getPayload, undefined, 2)}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
Main.propTypes = {
    mainStore: PropTypes.object,
    isUpdateComplete: PropTypes.bool,
};
export default Main;
