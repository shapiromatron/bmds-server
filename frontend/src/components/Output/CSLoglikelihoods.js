import React from "react";

const CSLoglikelihoods = props => {
    return (
        <table className="table table-bordered table-sm">
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
    );
};

export default CSLoglikelihoods;
