import React from "react";

const CSTestofInterest = props => {
    return (
        <table className="table table-bordered table-sm">
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
    );
};

export default CSTestofInterest;
