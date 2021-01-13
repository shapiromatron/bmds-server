import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./ModelDetailModal";
import ResultsTable from "./ResultsTable";
import DatasetTable from "../Data/DatasetTable";
import OutputSelector from "./OutputSelector";
import DoseResponsePlot from "../common/DoseResponsePlot";
import SelectModel from "./SelectModel";
import "./Output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            {canEdit, selectedOutput} = outputStore;

        if (selectedOutput === null) {
            return (
                <div className="container-fluid">
                    <p>No results available.</p>
                </div>
            );
        }

        if ("error" in selectedOutput) {
            return (
                <div className="container-fluid">
                    <pre>{selectedOutput.error}</pre>
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
                        {canEdit ? <SelectModel /> : null}
                    </div>
                    <div className="col col-lg-4">
                        <DoseResponsePlot
                            layout={outputStore.drPlotLayout}
                            data={outputStore.drPlotData}
                        />
                    </div>
                </div>
                <div>{outputStore.showModelModal ? <ModelDetailModal /> : null}</div>
            </div>
        );
    }
}
Output.propTypes = {
    outputStore: PropTypes.object,
};
export default Output;
