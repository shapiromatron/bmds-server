import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import ModelDetailModal from "../IndividualModel/ModelDetailModal";
import FrequentistResultTable from "./FrequentistResultTable";
import BayesianResultTable from "./BayesianResultTable";
import DatasetTable from "../Data/DatasetTable";
import SelectModel from "./SelectModel";
import DoseResponsePlot from "../common/DoseResponsePlot";
import "./Output.css";

import SelectInput from "../common/SelectInput";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            {
                canEdit,
                selectedOutputErrorMessage,
                selectedFrequentist,
                selectedBayesian,
            } = outputStore;

        if (selectedOutputErrorMessage) {
            return (
                <div className="container-fluid">
                    <pre>{selectedOutputErrorMessage}</pre>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-2">
                        <SelectInput
                            label="Select an output"
                            onChange={value => outputStore.setSelectedOutputIndex(parseInt(value))}
                            value={outputStore.selectedOutputIndex}
                            choices={outputStore.outputs.map((output, idx) => {
                                return {value: idx, text: outputStore.getOutputName(idx)};
                            })}
                        />
                    </div>
                    <div className="col-lg-6">
                        <DatasetTable dataset={outputStore.selectedDataset} />
                    </div>
                </div>
                {selectedFrequentist ? (
                    <div className="row">
                        <div className="col-lg-8">
                            <h4>Frequentist Model Results</h4>
                            <FrequentistResultTable />
                            {canEdit ? <SelectModel /> : null}
                        </div>
                        <div className="align-items-center d-flex col-lg-4">
                            <DoseResponsePlot
                                onRelayout={outputStore.saveUserPlotSettings}
                                layout={outputStore.drFrequentistPlotLayout}
                                data={outputStore.drFrequentistPlotData}
                            />
                        </div>
                    </div>
                ) : null}
                {selectedBayesian ? (
                    <div className="row">
                        <div className="col-lg-12">
                            <h4>Bayesian Model Results</h4>
                            <BayesianResultTable />
                        </div>
                        <div className="col-lg-12">
                            <DoseResponsePlot
                                onRelayout={outputStore.saveUserPlotSettings}
                                layout={outputStore.drBayesianPlotLayout}
                                data={outputStore.drBayesianPlotData}
                            />
                        </div>
                    </div>
                ) : null}
                <div className="row">
                    {selectedFrequentist ? (
                        <div className="col col-lg-6">
                            <DoseResponsePlot
                                layout={outputStore.drFrequentistLollipopPlotLayout}
                                data={outputStore.drFrequentistLollipopPlotDataset}
                            />
                        </div>
                    ) : null}
                    {selectedBayesian ? (
                        <div className="col col-lg-6">
                            <DoseResponsePlot
                                layout={outputStore.drBayesianLollipopPlotLayout}
                                data={outputStore.drBayesianLollipopPlotDataset}
                            />
                        </div>
                    ) : null}
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
