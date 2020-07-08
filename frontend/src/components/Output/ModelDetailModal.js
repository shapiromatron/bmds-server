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
import ResponsePlot from "./ResponsePlot";
import CSLoglikelihoods from "./CSLoglikelihoods";

@inject("outputStore")
@observer
class ModelDetailModal extends Component {
    render() {
        const {outputStore} = this.props,
            toggleModelDetailModal = () => {
                outputStore.toggleModelDetailModal();
            };
        return (
            <div>
                <div className="modal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <Modal
                                show={outputStore.modelDetailModal}
                                onHide={toggleModelDetailModal}
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        {" "}
                                        Model details
                                    </Modal.Title>
                                    <button
                                        className="btn btn-danger"
                                        style={{float: "right"}}
                                        onClick={() => toggleModelDetailModal()}>
                                        <i className="fa fa-times" aria-hidden="true"></i>
                                    </button>
                                </Modal.Header>

                                <Modal.Body>
                                    <div className="modal-body">
                                        <div className="row">
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
                                        <div className="row">
                                            <div className="col col-sm-3 benchmarkdose">
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
                                        <div className="row">
                                            <div className="col ">
                                                <GoodnessFit
                                                    headers={outputStore.goodnessFitHeaders}
                                                    goodnessFit={outputStore.goodnessFit}
                                                    model_type={outputStore.selectedModelType}
                                                />
                                            </div>
                                        </div>
                                        {outputStore.selectedModelType == "CS" ? (
                                            <CSLoglikelihoods
                                                loglikelihoods={outputStore.loglikelihoods}
                                                test_of_interest={outputStore.test_of_interest}
                                            />
                                        ) : null}

                                        <div className="row">
                                            <div className="col col-sm-3">
                                                <CDFTable cdfValues={outputStore.cdfValues} />
                                            </div>
                                            <div className="col col-sm-6">
                                                <ResponsePlot style={{float: "right"}} />
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
