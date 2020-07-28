import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import ModelDetailModal from "./modelDetailModal";
import "./output.css";
import DatasetPlot from "./DatasetPlot";
import Results from "./Results";
import DatasetList from "../Data/DatasetList";
import InputFormReadOnly from "../Data/InputFormReadOnly";

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
            },
            onClick = (e, id) => {
                outputStore.setCurrentDatasetIndex(id);
            },
            selectedOutput = outputStore.getCurrentOutput(outputStore.selectedDatasetIndex),
            datasetList = outputStore.getDatasets();
        let mappedDatasets = [];
        let labels = [];
        if (selectedOutput != null) {
            labels = outputStore.getLabels(selectedOutput.dataset.model_type);
            mappedDatasets = outputStore.getMappingDataset(selectedOutput.dataset);
        }
        return (
            <div className="output container-fluid">
                {selectedOutput ? (
                    <div>
                        <div>
                            <div className="row justify-content-around">
                                <div className="col col-sm-2">
                                    <DatasetList
                                        datasets={datasetList}
                                        onClick={onClick.bind(this)}
                                    />
                                </div>
                                <div className="col col-sm-4 col-md-auto col-sm-auto inputformreadonly">
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
                                    <DatasetPlot
                                        data={outputStore.plotdata}
                                        layout={outputStore.layout}
                                    />
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
