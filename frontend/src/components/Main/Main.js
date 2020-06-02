import React, {Component} from "react";

import AnalysisForm from "./AnalysisForm";
import ModelsCheckBoxList from "./ModelsCheckBoxList";
import DatasetName from "./DatasetName";
import OptionsFormList from "./OptionsFormList";
import MainModal from "./MainModal";
import "./main.css";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class Main extends Component {
    render() {
        return (
            <div>
                <div className="container ">
                    <div>
                        <div className="row">
                            <div className="col col-sm-5">
                                <AnalysisForm />
                            </div>
                            {this.props.store.getDataLength > 0 ? (
                                <div className="col col-sm-5">
                                    <DatasetName />
                                </div>
                            ) : null}
                        </div>
                        {this.props.store.analysisForm.dataset_type ? (
                            <div className="row">
                                <div className="col">
                                    <ModelsCheckBoxList />
                                </div>
                            </div>
                        ) : null}
                        {this.props.store.analysisForm.dataset_type ? (
                            <div className="row">
                                <div className="col">
                                    <OptionsFormList />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
                <MainModal />
            </div>
        );
    }
}

export default Main;
