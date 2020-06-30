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
                    <div>
                        <div className="main">
                            <div className="row">
                                <div className="col col-sm-5">
                                    <AnalysisForm />
                                </div>

                                <div className="col col-sm-5">
                                    <DatasetList />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <ModelsCheckBoxList />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
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
