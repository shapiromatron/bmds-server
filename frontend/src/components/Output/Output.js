import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./ModelDetailModal";
import ResultsTable from "./ResultsTable";
import DatasetTable from "../Data/DatasetTable";
import OutputSelector from "./OutputSelector";
import ResponsePlot from "./ResponsePlot";
import "./Output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props;
        if (outputStore.selectedOutput === null) {
            return (
                <div className="container-fluid">
                    <p>No results available.</p>
                </div>
            );
        }

        if ("error" in outputStore.selectedOutput) {
            return (
                <div className="container-fluid">
                    <pre>{outputStore.selectedOutput.error}</pre>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col col-lg-2">
                        <OutputSelector />
                    </div>
                    <div className="col col-lg-6">
                        <DatasetTable dataset={outputStore.selectedDataset} />
                        <ResultsTable />
                    </div>
                    <div className="col col-lg-4">
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
};
export default Output;
