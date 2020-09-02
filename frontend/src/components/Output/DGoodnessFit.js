import React from "react";
import PropTypes from "prop-types";

const DGoodnessFit = props => {
    return (
        <tbody>
            {props.goodnessFit.map((row, index) => {
                return (
                    <tr key={index}>
                        <td>{row.dose}</td>
                        <td>{row.est_prob}</td>
                        <td>{row.expected}</td>
                        <td>{row.observed}</td>
                        <td>{row.size}</td>
                        <td>{row.scaled_residual}</td>
                    </tr>
                );
            })}
        </tbody>
    );
};
DGoodnessFit.propTypes = {
    goodnessFit: PropTypes.array,
};
export default DGoodnessFit;
