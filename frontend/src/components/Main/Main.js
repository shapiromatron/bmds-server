import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm";
import ModelsCheckBoxList from "./ModelsCheckBoxList";
import OptionsFormList from "./OptionsFormList";
import MainModal from "./MainModal";
import "./main.css";

import {inject, observer} from "mobx-react";
import DatasetList from "./DatasetList";

@inject("mainStore")
@observer
class Main extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div>
                {mainStore.isUpdateComplete ? (
                    <div className="main container-fluid ">
                        <div className="row first-row">
                            <div className="col-lg-3">
                                <div className="analysis">
                                    <AnalysisForm />
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="modelsCheckbox">
                                    <ModelsCheckBoxList />
                                </div>
                            </div>
                        </div>
                        <div className="row second-row">
                            <div className="col-lg-3">
                                <div className="datasetlist">
                                    <DatasetList />
                                </div>
                            </div>
                            <div className="col-lg-7">
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

export default Main;
