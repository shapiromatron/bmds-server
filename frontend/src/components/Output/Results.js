import React from "react";
import PropTypes from "prop-types";

const Results = props => {
    return (
        <table className="table table-bordered result table-sm">
            <thead>
                <tr className="table-primary">
                    <th>Model</th>
                    <th>BMD</th>
                    <th>BMDL</th>
                    <th>BMDU</th>
                    <th>AIC</th>
                </tr>
            </thead>
            <tbody>
                {props.selectedOutput.models.map((model, idx) => {
                    return (
                        <tr
                            key={idx}
                            onMouseOver={e => props.onMouseOver(e, model)}
                            onMouseOut={e => props.onMouseOut(e)}>
                            <td className="button">
                                <button
                                    onClick={e => props.onClick(e, model)}
                                    className="btn btn-sm btn-link">
                                    {model.model_name}{" "}
                                </button>
                            </td>
                            <td>{model.results.bmd}</td>
                            <td>{model.results.bmdl}</td>
                            <td>{model.results.bmdu}</td>
                            <td>{model.results.aic}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

Results.propTypes = {
    selectedOutput: PropTypes.object,
    models: PropTypes.array,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    onClick: PropTypes.func,
};
export default Results;
