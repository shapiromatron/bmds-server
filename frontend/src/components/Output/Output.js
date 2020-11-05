import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./ModelDetailModal";
import ResultsTable from "./ResultsTable";
import InputFormReadOnly from "../Data/InputFormReadOnly";
import DatasetNames from "../Data/DatasetNames";
import ResponsePlot from "./ResponsePlot";
import "./Output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props;

        if (outputStore.getCurrentOutput === null) {
            return (
                <div className="container-fluid">
                    <p>No results available.</p>
                </div>
            );
        }

        if ("error" in outputStore.getCurrentOutput) {
            return (
                <div className="container-fluid">
                    <p>{outputStore.getCurrentOutput.error}</p>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <DatasetNames />
                    </div>
                    <div className="col px-3">
                        <InputFormReadOnly />
                        <ResultsTable />
                    </div>
                    <div className="col">
                        <ResponsePlot />
                    </div>
                </div>
                <div>{outputStore.modelDetailModal ? <ModelDetailModal /> : null}</div>
            </div>
        );
    }
}
Output.propTypes = {
    outputStore: PropTypes.object,
    toggleModelDetailModal: PropTypes.func,
    getCurrentOutput: PropTypes.func,
    getLabels: PropTypes.func,
    getMappedDatasets: PropTypes.func,
    dataset: PropTypes.object,
    removeBMDLine: PropTypes.func,
    error: PropTypes.string,
    modelDetailModal: PropTypes.bool,
};
export default Output;
