import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./ModelDetailModal";
import ResultsTable from "./ResultsTable";
import DatasetTable from "../Data/DatasetTable";
import DatasetSelector from "../Data/DatasetSelector";
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
                    <div className="col-md-2">
                        <DatasetSelector />
                    </div>
                    <div className="col-md-6">
                        <DatasetTable />
                        <ResultsTable />
                    </div>
                    <div className="col-md-4">
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
    getMappedDatasets: PropTypes.func,
    dataset: PropTypes.object,
    removeBMDLine: PropTypes.func,
    error: PropTypes.string,
    modelDetailModal: PropTypes.bool,
};
export default Output;
