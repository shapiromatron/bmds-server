import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import ModelDetailModal from "./modelDetailModal";
import Results from "./Results";
import InputFormReadOnly from "../Data/InputFormReadOnly";
import DatasetNames from "../Data/DatasetNames";
import ResponsePlot from "./ResponsePlot";
import "./output.css";

@inject("outputStore")
@observer
class Output extends Component {
    render() {
        const {outputStore} = this.props,
            onMouseOver = (e, model) => {
                outputStore.addBMDLine(model);
            },
            showModal = (e, model) => {
                outputStore.toggleModelDetailModal(model);
            };
        return (
            <div className="container-fluid">
                {outputStore.getCurrentOutput != null ? (
                    <div>
                        {!("error" in outputStore.getCurrentOutput) ? (
                            <div>
                                <div className="row justify-content-lg-around">
                                    <div className="col-xs-12 col-md-2">
                                        <DatasetNames />
                                    </div>
                                    <div className="col-xs-12 col-md-auto">
                                        <InputFormReadOnly />
                                        <Results
                                            onMouseOver={onMouseOver.bind(this)}
                                            onMouseOut={() => outputStore.removeBMDLine()}
                                            selectedOutput={outputStore.getCurrentOutput}
                                            onClick={showModal.bind(this)}
                                        />
                                    </div>
                                    <div className="col-xs-12 col-md-4">
                                        <ResponsePlot />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>{outputStore.getCurrentOutput.error}</p>
                        )}

                        <div>{outputStore.modelDetailModal ? <ModelDetailModal /> : null}</div>
                    </div>
                ) : null}
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
