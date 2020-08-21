import React from "react";
import PropTypes from "prop-types";

const CSGoodnessFit = props => {
    return (
        <tbody>
            {props.goodnessFit.map((row, index) => {
                return [
                    <tr key={index}>
                        <td>{row.dose}</td>
                        <td>{row.obs_mean}</td>
                        <td>{row.obs_stdev}</td>
                        <td>{row.calc_median}</td>
                        <td>{row.calc_gsd}</td>
                        <td>{row.est_mean}</td>
                        <td>{row.est_stdev}</td>
                        <td>{row.size}</td>
                        <td>{row.scaled_residual}</td>
                    </tr>,
                ];
            })}
        </tbody>
    );
};

CSGoodnessFit.propTypes = {
    goodnessFit: PropTypes.array,
};
export default CSGoodnessFit;
