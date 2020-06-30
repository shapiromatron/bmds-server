import React from "react";

const CSGoodnessFit = props => {
    return (
        <tbody>
            {props.goodnessfit.map((row, index) => {
                return [
                    <tr key={index}>
                        <td>{row.dose}</td>
                        <td>{row.size}</td>
                        <td>{row.est_mean}</td>
                        <td>{row.calc_median}</td>
                        <td>{row.obs_mean}</td>
                        <td>{row.est_stdev}</td>
                        <td>{row.calc_stdev}</td>
                        <td>{row.obs_stdev}</td>
                        <td>{row.scaled_residual}</td>
                    </tr>,
                ];
            })}
        </tbody>
    );
};

export default CSGoodnessFit;
