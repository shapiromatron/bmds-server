import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm/AnalysisForm";
import ModelsCheckBoxList from "./ModelsForm/ModelsCheckBoxList";
import OptionsFormList from "./OptionsForm/OptionsFormList";
import MainModal from "./ErrorModal";
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
                    <div className="main container-fluid ">
                        <div className="row">
                            <div className="col-sm-12 col-lg-3 analysis">
                                {mainStore.getEditSettings ? (
                                    <AnalysisForm />
                                ) : (
                                    <AnalysisFormReadOnly />
                                )}
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <div className="modelsCheckbox">
                                    <ModelsCheckBoxList />
                                </div>
                            </div>
                        </div>
                        <div className="row second-row">
                            <div className="col-sm-12 col-lg-3">
                                <div className="datasetlist">
                                    {mainStore.getDatasetLength ? <DatasetList /> : null}
                                </div>
                            </div>
                            <div className="col-sm-12 col-lg-8">
                                <div className="optionslist">
                                    <OptionsFormList />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
                <MainModal />
            </div>
        );
    }
}
Main.propTypes = {
    mainStore: PropTypes.object,
    isUpdateComplete: PropTypes.bool,
};
export default Main;
