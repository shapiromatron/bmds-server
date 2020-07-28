import React, {Component} from "react";
import InputFormList from "./InputFormList";
import InputButtons from "./InputButtons";
import "./Data.css";
import {inject, observer} from "mobx-react";
import DatasetPlot from "../Output/DatasetPlot";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props,
            outputs = dataStore.getExecutionOutputs();
        return (
            <div className="data container-fluid">
                <div className="row data-row">
                    <div className="col col-lg-3 inputbuttons">
                        <InputButtons />
                    </div>
                    <div className="col">{dataStore.getDataLength ? <InputFormList /> : null}</div>
                    <div className="col scatterplot">{outputs ? <DatasetPlot /> : null}</div>
                </div>
            </div>
        );
    }
}

export default Data;
