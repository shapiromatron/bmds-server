import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

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
                                        <div className="row ">
                                            <div className="col col-sm-4 ">
                                                <InfoTable />
                                            </div>
                                            <div className="col col-sm-3 offset-sm-1">
                                                <ModelOptionsTable />
                                            </div>
                                            <div className="col col-sm-3 offset-sm-1">
                                                <ModelData />
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col col-sm-3 ">
                                                <BenchmarkDose />
                                            </div>
                                            <div className="col col-sm-3 offset-sm-2">
                                                <ModelParameters />
                                            </div>
                                        </div>
                                        <div className="row justify-content-around">
                                            <div className="col ">
                                                <GoodnessFit />
                                            </div>
                                        </div>

                                        {outputStore.getCurrentOutput.dataset.model_type == "CS" ? (
                                            <div className="row">
                                                <div className="col col-sm-3">
                                                    <CSLoglikelihoods />
                                                </div>
                                                <div className="col col-sm-3 offset-sm-2 ">
                                                    <CSTestofInterest />
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="row ">
                                            <div className="col col-sm-3 text-center">
                                                <CDFTable />
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
ModelDetailModal.propTypes = {
    outputStore: PropTypes.object,
    modelDetailModal: PropTypes.bool,
    toggleModelDetailModal: PropTypes.func,
    selectedModel: PropTypes.object,
    model_name: PropTypes.string,
    getCurrentOutput: PropTypes.func,
    dataset: PropTypes.object,
    model_type: PropTypes.string,
};
export default ModelDetailModal;
