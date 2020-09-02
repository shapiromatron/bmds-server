import React from "react";
import PropTypes from "prop-types";

const DatasetsReadOnly = props => {
    return (
        <tbody>
            {props.datasets.map((item, index) => {
                return [
                    <tr key={index}>
                        <td>
                            {item.enabled ? (
                                <i className="fa fa-check-square-o"></i>
                            ) : (
                                <i className="fa fa-square-o"></i>
                            )}
                        </td>
                        <td>{item.dataset_name}</td>
                        <td>
                            <p>{item.adverse_direction}</p>
                        </td>
                    </tr>,
                ];
            })}
        </tbody>
    );
};
DatasetsReadOnly.propTypes = {
    datasets: PropTypes.array,
};
export default DatasetsReadOnly;
