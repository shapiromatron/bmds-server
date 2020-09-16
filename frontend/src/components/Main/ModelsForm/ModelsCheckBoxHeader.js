import React from "react";
import PropTypes from "prop-types";
import {model} from "../../../constants/modelConstants";

const ModelsCheckBoxHeader = props => {
    return (
        <thead className="table-primary">
            {Object.keys(props.model_headers).map((item, index) => {
                return (
                    <tr key={index}>
                        <th>{props.model_headers[item].model}</th>
                        {props.model_headers[item].values.map((dev, index) => {
                            return (
                                <th key={index} colSpan={dev.colspan}>
                                    {dev.name}{" "}
                                    {(dev.name === "Enable") & props.isEditSettings ? (
                                        <input
                                            type="checkbox"
                                            onChange={e =>
                                                props.enableAll(dev.model_name, e.target.checked)
                                            }
                                            checked={dev.isChecked}
                                        />
                                    ) : null}
                                    &emsp;
                                    {dev.model_name === model.Bayesian_Model_Average
                                        ? dev.prior_weight
                                        : null}
                                </th>
                            );
                        })}
                    </tr>
                );
            })}
        </thead>
    );
};
ModelsCheckBoxHeader.propTypes = {
    model_headers: PropTypes.object,
    model: PropTypes.string,
    values: PropTypes.array,
    isEditSettings: PropTypes.bool,
    onChange: PropTypes.func,
    enableAll: PropTypes.func,
};
export default ModelsCheckBoxHeader;
