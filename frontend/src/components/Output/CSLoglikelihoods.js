import React from "react";

const CSLoglikelihoods = props => {
    return (
        <div>
            <div className="row row-flex">
                <div className="col">
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="4">Likelihoods of Interest</th>
                            </tr>
                            <tr>
                                <th>Model</th>
                                <th>Log Likelihood*</th>
                                <th># of Parameters</th>
                                <th>AIC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.loglikelihoods.map((row, index) => {
                                return [
                                    <tr key={index}>
                                        <td>{row.model}</td>
                                        <td>{row.loglikelihood}</td>
                                        <td>{row.n_parms}</td>
                                        <td>{row.aic}</td>
                                    </tr>,
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="col">
                    <table className="table table-bordered">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="4">Test of Interest</th>
                            </tr>
                            <tr>
                                <th>Test</th>
                                <th>-2*Log(Likelihood Ratio)</th>
                                <th>Test df</th>
                                <th>p-value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.test_of_interest.map((row, index) => {
                                return [
                                    <tr key={index}>
                                        <td>{row.test_number}</td>
                                        <td>{row.deviance}</td>
                                        <td>{row.df}</td>
                                        <td>{row.p_value}</td>
                                    </tr>,
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CSLoglikelihoods;
