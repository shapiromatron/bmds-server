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
                                <div className="mb-2">
                                    {mainStore.getEditSettings ? (
                                        <AnalysisForm />
                                    ) : (
                                        <AnalysisFormReadOnly />
                                    )}
                                </div>
                                <div>{mainStore.getDatasetLength ? <DatasetList /> : null}</div>
                            </div>
                            <div className="col-lg-8">
                                <div>
                                    <ModelsCheckBoxList />
                                </div>
                                <div>
                                    <OptionsFormList />
                                </div>
                            </div>
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
