import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import ModelDetailModal from "./modelDetailModal";
import "./output.css";
import Results from "./Results";
import InputFormReadOnly from "../Data/InputFormReadOnly";
import DatasetNames from "../Data/DatasetNames";
import ResponsePlot from "./ResponsePlot";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            onMouseOver = (e, model) => {
                outputStore.addBMDLine(model);
            },
            onMouseOut = e => {
                outputStore.removeBMDLine();
            },
            showModal = (e, selectedOutput, index) => {
                outputStore.toggleModelDetailModal(selectedOutput, index);
            },
            selectedOutput = outputStore.getCurrentOutput(outputStore.selectedDatasetIndex);
        let mappedDatasets = [];
        let labels = [];
        if (selectedOutput != null) {
            labels = outputStore.getLabels(selectedOutput.dataset.model_type);
            mappedDatasets = outputStore.getMappingDataset(selectedOutput.dataset);
        }
        let title =
            "BMR of 1 Std. Dev. for the BMD <br> and 0.95 Lower Confidence Limit for the BMDL";
        return (
            <div className="container-fluid output">
                {selectedOutput != null ? (
                    <div>
                        {!("error" in selectedOutput) ? (
                            <div>
                                <div className="row justify-content-lg-around">
                                    <div className="col-xs-12 col-sm-12 col-md-2">
                                        <DatasetNames />
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-auto">
                                        <InputFormReadOnly
                                            labels={labels}
                                            datasets={mappedDatasets}
                                            currentDataset={selectedOutput.dataset}
                                        />
                                        <Results
                                            onMouseOver={onMouseOver.bind(this)}
                                            onMouseOut={onMouseOut}
                                            selectedOutput={selectedOutput}
                                            onClick={showModal.bind(this)}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-sm-12 col-md-4">
                                        <ResponsePlot
                                            currentDataset={selectedOutput.dataset}
                                            title={title}
                                        />
                                    </div>
                                </div>
                                ,
                            </div>
                        ) : (
                            <p>{selectedOutput.error}</p>
                        )}

                        <div>
                            {outputStore.modelDetailModal ? (
                                <ModelDetailModal currentDataset={selectedOutput.dataset} />
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Output;
