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
    constructor(props) {
        super(props);
        this.props.outputStore.setDefaultState();
    }
    render() {
        const {outputStore} = this.props,
            onMouseOver = (e, model) => {
                outputStore.addBMDLine(model);
            },
            showModal = (e, index) => {
                outputStore.toggleModelDetailModal(index);
            };
        return (
            <div className="container-fluid">
                {outputStore.currentOutput != null ? (
                    <div>
                        {!("error" in outputStore.currentOutput) ? (
                            <div>
                                <div className="row justify-content-lg-around">
                                    <div className="col-xs-12 col-md-2">
                                        <DatasetNames />
                                    </div>
                                    <div className="col-xs-12 col-md-auto">
                                        <InputFormReadOnly
                                            labels={outputStore.labels}
                                            datasets={outputStore.mappedDatasets}
                                            currentDataset={outputStore.currentOutput.dataset}
                                        />
                                        <Results
                                            onMouseOver={onMouseOver.bind(this)}
                                            onMouseOut={() => outputStore.removeBMDLine()}
                                            selectedOutput={outputStore.currentOutput}
                                            onClick={showModal.bind(this)}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-md-4">
                                        <ResponsePlot />
                                    </div>
                                </div>
                                ,
                            </div>
                        ) : (
                            <p>{outputStore.currentOutput.error}</p>
                        )}

                        <div>
                            {outputStore.modelDetailModal ? (
                                <ModelDetailModal
                                    currentDataset={outputStore.currentOutput.dataset}
                                />
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Output;
