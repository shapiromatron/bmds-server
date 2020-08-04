import React, {Component} from "react";
import InputFormList from "./InputFormList";
import InputButtons from "./InputButtons";
import "./Data.css";
import {inject, observer} from "mobx-react";
import ResponsePlot from "../Output/ResponsePlot";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props,
            outputs = dataStore.getExecutionOutputs(),
            title = "Scatter Plot",
            currentDataset = dataStore.getCurrentDataset(dataStore.selectedDatasetIndex);
        return (
            <div className="container-fluid">
                <div className="row justify-content-sm-around">
                    <div className="col-xs-12 col-sm-12 col-md-3">
                        <InputButtons />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
                        {dataStore.getDataLength ? <InputFormList /> : null}
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-4">
                        {outputs ? (
                            <ResponsePlot title={title} currentDataset={currentDataset} />
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Data;
