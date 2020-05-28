import React, {Component} from "react";
import {Modal, Button} from "react-bootstrap";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class ModelDetailModal extends Component {
    toggleModelDetailModal = () => {
        this.props.store.toggleModelDetailModal();
    };
    render() {
        const {store} = this.props;
        return (
            <div>
                <div className="container-fluid">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <Modal
                                show={store.modelDetailModal}
                                onHide={this.toggleModelDetailModal}
                                size="xl"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered>
                                <Modal.Header>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                        {" "}
                                        Model details
                                        <Button
                                            className=" close"
                                            aria-label="Close"
                                            style={{float: "right"}}
                                            onClick={() => this.toggleModelDetailModal()}>
                                            <span aria-hidden="true">&times;</span>
                                        </Button>
                                    </Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <div>
                                        <div className="row">
                                            <div className="col col-sm-5">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Info</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(store.infoTable).map(
                                                            (dev, i) => {
                                                                return [
                                                                    <tr key={i}>
                                                                        <td>{dev}</td>
                                                                        <td>
                                                                            {store.infoTable[dev]}
                                                                        </td>
                                                                    </tr>,
                                                                ];
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col col-sm-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Model Options</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(store.optionSettings).map(
                                                            (dev, i) => {
                                                                return [
                                                                    <tr key={i}>
                                                                        <td>{dev}</td>
                                                                        <td>
                                                                            {
                                                                                store
                                                                                    .optionSettings[
                                                                                    dev
                                                                                ]
                                                                            }
                                                                        </td>
                                                                    </tr>,
                                                                ];
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col col-sm-4">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Model Data</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(store.modelData).map(
                                                            (dev, i) => {
                                                                return [
                                                                    <tr key={i}>
                                                                        <td>{dev}</td>
                                                                        <td>
                                                                            {store.modelData[dev]}
                                                                        </td>
                                                                    </tr>,
                                                                ];
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col col-sm-4">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Benchmark Dose</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(store.benchmarkDose).map(
                                                            (dev, i) => {
                                                                return [
                                                                    <tr key={i}>
                                                                        <td>{dev}</td>
                                                                        <td>
                                                                            {
                                                                                store.benchmarkDose[
                                                                                    dev
                                                                                ]
                                                                            }
                                                                        </td>
                                                                    </tr>,
                                                                ];
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col col-sm-6">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Model Parameters</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Variable</th>
                                                            <th>Parameter</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {store.parameters.map((value, i) => {
                                                            return [
                                                                <tr key={i}>
                                                                    <td>{value.p_variable}</td>
                                                                    <td>{value.parameter}</td>
                                                                </tr>,
                                                            ];
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col col-sm-4">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="9">Goodness of Fit</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Dose</th>
                                                            <th>size</th>
                                                            {store.selectedModelType == "D" ? (
                                                                <th>Estimated Probability</th>
                                                            ) : null}
                                                            {store.selectedModelType == "D" ? (
                                                                <th>Expected</th>
                                                            ) : null}
                                                            {store.selectedModelType == "D" ? (
                                                                <th>Observed</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Estimated Median</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Calculated Median</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Observed Mean</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Estimated SD</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Calculated SD</th>
                                                            ) : null}
                                                            {store.selectedModelType == "CS" ? (
                                                                <th>Observed SD</th>
                                                            ) : null}
                                                            <th>Scaled Residual</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {store.goodnessFit.map((row, index) => {
                                                            return [
                                                                <tr key={index}>
                                                                    <td>{row.dose}</td>
                                                                    <td>{row.size}</td>
                                                                    {store.selectedModelType ==
                                                                    "D" ? (
                                                                        <td>{row.est_prob}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "D" ? (
                                                                        <td>{row.expected}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "D" ? (
                                                                        <td>{row.observed}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td></td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td>{row.calc_median}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td>{row.obs_mean}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td>{row.est_stdev}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td>{row.calc_gsd}</td>
                                                                    ) : null}
                                                                    {store.selectedModelType ==
                                                                    "CS" ? (
                                                                        <td>{row.obs_stdev}</td>
                                                                    ) : null}
                                                                    <td>{row.scaled_residual}</td>
                                                                </tr>,
                                                            ];
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {store.selectedModelType == "CS" ? (
                                            <div className="row">
                                                <div>
                                                    <div className="col col-sm-4">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="4">
                                                                        Likelihoods of Interest
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Model</th>
                                                                    <th>Log Likelihood*</th>
                                                                    <th># of Parameters</th>
                                                                    <th>AIC</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {store.loglikelihoods.map(
                                                                    (row, index) => {
                                                                        return [
                                                                            <tr key={index}>
                                                                                <td>{row.model}</td>
                                                                                <td>
                                                                                    {
                                                                                        row.loglikelihood
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {row.n_parms}
                                                                                </td>
                                                                                <td>{row.aic}</td>
                                                                            </tr>,
                                                                        ];
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col col-sm-4">
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th colSpan="4">
                                                                        Test of Interest
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th>Test</th>
                                                                    <th>
                                                                        -2*Log(Likelihood Ratio)
                                                                    </th>
                                                                    <th>Test df</th>
                                                                    <th>p-value</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {store.test_of_interest.map(
                                                                    (row, index) => {
                                                                        return [
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    {
                                                                                        row.test_number
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {row.deviance}
                                                                                </td>
                                                                                <td>{row.df}</td>
                                                                                <td>
                                                                                    {row.p_value}
                                                                                </td>
                                                                            </tr>,
                                                                        ];
                                                                    }
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        <div className="row">
                                            <div className="col col-sm-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">CDF</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Percentile</th>
                                                            <th>BMD</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {store.cdfValues.map((value, i) => {
                                                            return [
                                                                <tr key={i}>
                                                                    <td>{value.pValue}</td>
                                                                    <td>{value.cdf}</td>
                                                                </tr>,
                                                            ];
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col col-sm-6">
                                                <h4 style={{float: "right"}}>Plot</h4>
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
