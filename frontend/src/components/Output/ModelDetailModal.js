import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";

import InfoTable from "./InfoTable";
import ModelOptionsTable from "./ModelOptionsTable";
import BenchmarkDose from "./BenchmarkDose";
import ModelData from "./ModelData";
import ModelParameters from "./ModelParameters";
import GoodnessFit from "./GoodnessFit";
import CDFTable from "./CDFTable";
import CDFPlot from "./CDFPlot";
import CSLoglikelihoods from "./CSLoglikelihoods";
import ResponsePlot from "./ResponsePlot";
import CSTestofInterest from "./CSTestofInterest";

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <div>
                <div className="modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <Modal
                                show={outputStore.modelDetailModal}
                                onHide={() => outputStore.toggleModelDetailModal()}
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        {" "}
                                        {outputStore.selectedModel.model_name} - Details
                                    </Modal.Title>
                                    <button
                                        className="btn btn-danger"
                                        style={{float: "right"}}
                                        onClick={() => outputStore.toggleModelDetailModal()}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </button>
                                </Modal.Header>

                                <Modal.Body>
                                    <div className="modal-body">
                                        <div className="row justify-content-around">
                                            <div className="col col-sm-4 infotable">
                                                <InfoTable infoTable={outputStore.infoTable} />
                                            </div>
                                            <div className="col col-sm-3 modeloptions">
                                                <ModelOptionsTable
                                                    modelOptions={outputStore.modelOptions}
                                                />
                                            </div>
                                            <div className="col col-sm-3">
                                                <ModelData modelData={outputStore.modelData} />
                                            </div>
                                        </div>
                                        <div className="row justify-content-around">
                                            <div className="col col-sm-3 ">
                                                <BenchmarkDose
                                                    benchmarkDose={outputStore.benchmarkDose}
                                                />
                                            </div>
                                            <div className="col col-sm-3">
                                                <ModelParameters
                                                    parameters={outputStore.parameters}
                                                />
                                            </div>
                                        </div>
                                        <div className="row justify-content-around">
                                            <div className="col ">
                                                <GoodnessFit
                                                    headers={outputStore.getGoodnessFitHeaders}
                                                    goodnessFit={outputStore.goodnessFit}
                                                    model_type={outputStore.selectedModelType}
                                                />
                                            </div>
                                        </div>

                                        {outputStore.selectedModelType == "CS" ? (
                                            <div className="row justify-content-around">
                                                <div className="col col-sm-3 text-center">
                                                    <CSLoglikelihoods
                                                        loglikelihoods={outputStore.loglikelihoods}
                                                    />
                                                </div>
                                                <div className="col col-sm-3 text-center">
                                                    <CSTestofInterest
                                                        test_of_interest={
                                                            outputStore.test_of_interest
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="row ">
                                            <div className="col col-sm-3 text-center">
                                                <CDFTable cdfValues={outputStore.cdfValues} />
                                            </div>
                                            <div className="col text-center">
                                                <ResponsePlot />
                                                <CDFPlot />
                                            </div>
                                        </div>
                                    </div>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModelDetailModal;
