import React, {Component} from "react";
import {Modal} from "react-bootstrap";
import {inject, observer} from "mobx-react";

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
                <div className="container-fluid">
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
                                        style={{float: "right"}}
                                        onClick={() => toggleModelDetailModal()}>
                                        <i className="fa fa-close" aria-hidden="true"></i>
                                    </button>
                                </Modal.Header>

                                <Modal.Body>
                                    <div>
                                        <div className="row">
                                            <div className="col col-sm-5 infotable">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Info</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {outputStore.infoTable.map((dev, i) => {
                                                            return [
                                                                <tr key={i}>
                                                                    <td>{dev.label}</td>
                                                                    <td>{dev.value}</td>
                                                                </tr>,
                                                            ];
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="col col-sm-3 modeloptions">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Model Options</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(
                                                            outputStore.optionSettings
                                                        ).map((dev, i) => {
                                                            return [
                                                                <tr key={i}>
                                                                    <td>{dev}</td>
                                                                    <td>
                                                                        {
                                                                            outputStore
                                                                                .optionSettings[dev]
                                                                        }
                                                                    </td>
                                                                </tr>,
                                                            ];
                                                        })}
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
                                                        {Object.keys(outputStore.modelData).map(
                                                            (dev, i) => {
                                                                return [
                                                                    <tr key={i}>
                                                                        <td>{dev}</td>
                                                                        <td>
                                                                            {
                                                                                outputStore
                                                                                    .modelData[dev]
                                                                            }
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
                                            <div className="col col-sm-4 benchmarkdose">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th colSpan="2">Benchmark Dose</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {outputStore.benchmarkDose.map((dev, i) => {
                                                            return [
                                                                <tr key={i}>
                                                                    <td>{dev.label}</td>
                                                                    <td>{dev.value}</td>
                                                                </tr>,
                                                            ];
                                                        })}
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
                                                        {outputStore.parameters.map((value, i) => {
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
                                                            {outputStore.goodnessFitHeaders.map(
                                                                (header, i) => {
                                                                    return [
                                                                        <th key={i}>{header}</th>,
                                                                    ];
                                                                }
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {outputStore.goodnessFit.map(
                                                            (row, index) => {
                                                                return [
                                                                    <tr key={index}>
                                                                        <td>{row.dose}</td>
                                                                        <td>{row.size}</td>
                                                                        {outputStore.selectedModelType ==
                                                                        "D" ? (
                                                                            <td>{row.est_prob}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "D" ? (
                                                                            <td>{row.expected}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "D" ? (
                                                                            <td>{row.observed}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td></td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td>
                                                                                {row.calc_median}
                                                                            </td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td>{row.obs_mean}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td>{row.est_stdev}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td>{row.calc_gsd}</td>
                                                                        ) : null}
                                                                        {outputStore.selectedModelType ==
                                                                        "CS" ? (
                                                                            <td>{row.obs_stdev}</td>
                                                                        ) : null}
                                                                        <td>
                                                                            {row.scaled_residual}
                                                                        </td>
                                                                    </tr>,
                                                                ];
                                                            }
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {outputStore.selectedModelType == "CS" ? (
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
                                                                {outputStore.loglikelihoods.map(
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
                                                                {outputStore.test_of_interest.map(
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
                                                        {outputStore.cdfValues.map((value, i) => {
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
