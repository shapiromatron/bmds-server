import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import ModelDetailModal from "./modelDetailModal";
import "./output.css";
import Results from "./Results";
import InputFormReadOnly from "../Data/InputFormReadOnly";
import DatasetNames from "../Data/DatasetNames";
import DatasetScatterplot from "../Data/DatasetScatterplot";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            onMouseOver = (e, index) => {
                outputStore.addPlotData(index);
            },
            onMouseOut = e => {
                outputStore.clearPlotData();
            },
            showModal = (e, selectedOutput, index) => {
                outputStore.toggleModelDetailModal(selectedOutput, index);
            };
        let selectedOutput = outputStore.getCurrentOutput(outputStore.selectedDatasetIndex);
        let mappedDatasets = [];
        let labels = [];
        if (selectedOutput != null) {
            labels = outputStore.getLabels(selectedOutput.dataset.model_type);
            mappedDatasets = outputStore.getMappingDataset(selectedOutput.dataset);
        }
        return (
            <div className="container-fluid output">
                {selectedOutput ? (
                    <div>
                        <div>
                            <div className="row justify-content-around">
                                <div className="col  col-sm-2 ">
                                    <DatasetNames />
                                </div>
                                <div className="col col-md-auto col-sm-auto col-xs-12 inputformreadonly">
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
                                <div className="col col-sm-4 datasetplot">
                                    <DatasetScatterplot />
                                </div>
                            </div>
                            ,
                        </div>

                        <div>{outputStore.modelDetailModal ? <ModelDetailModal /> : null}</div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Output;
