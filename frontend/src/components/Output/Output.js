import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./ModelDetailModal";
import {FrequentistResultTable, BayesianResultTable} from "./ResultsTable";
import DatasetTable from "../Data/DatasetTable";
import OutputSelector from "./OutputSelector";
import SelectModel from "./SelectModel";
import DoseResponsePlot from "../common/DoseResponsePlot";
import "./Output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            {canEdit, selectedOutput, selectedFrequentist, selectedBayesian} = outputStore;

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
                    <div className="col-lg-2">
                        <OutputSelector />
                    </div>
                    <div className="col-lg-6">
                        <DatasetTable dataset={outputStore.selectedDataset} />
                    </div>
                </div>
                <div className="row">
                    {selectedFrequentist ? (
                        <div className="col-lg-8">
                            <h4>Frequentist Model Results</h4>
                            <FrequentistResultTable />
                            {canEdit ? <SelectModel /> : null}
                        </div>
                    ) : null}
                    <div className="align-items-center d-flex col-lg-4">
                        {selectedFrequentist ? (
                            <DoseResponsePlot
                                layout={outputStore.drFrequentistPlotLayout}
                                data={outputStore.drFrequentistPlotData}
                            />
                        ) : null}
                    </div>
                </div>
                {selectedBayesian ? (
                    <div className="row">
                        <div className="col-lg-12">
                            <h4>Bayesian Model Results</h4>
                            <BayesianResultTable />
                        </div>
                        <div className="col-lg-12">
                            <DoseResponsePlot
                                layout={outputStore.drBayesianPlotLayout}
                                data={outputStore.drBayesianPlotData}
                            />
                        </div>
                    </div>
                ) : null}
                <div>{outputStore.showModelModal ? <ModelDetailModal /> : null}</div>
            </div>
        );
    }
}
Output.propTypes = {
    outputStore: PropTypes.object,
};
export default Output;
