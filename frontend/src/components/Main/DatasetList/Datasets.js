import React from "react";
import PropTypes from "prop-types";

const Datasets = props => {
    return (
        <tr>
            <td>
                <input
                    type="checkbox"
                    checked={props.dataset.enabled}
                    onChange={e =>
                        props.toggleDataset("enabled", e.target.checked, props.dataset.dataset_id)
                    }
                />
            </td>
            <td>{props.dataset.dataset_name}</td>
            {props.dataset_type == "C" ? (
                <td>
                    {" "}
                    <select
                        className="form-control"
                        onChange={e =>
                            props.toggleDataset(
                                "adverse_direction",
                                e.target.value,
                                props.dataset.dataset_id
                            )
                        }>
                        {props.adverseList.map((adverse, i) => {
                            return (
                                <option key={i} value={adverse.value}>
                                    {adverse.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.dataset_type == "DM" ? (
                <td>
                    {" "}
                    <select
                        as="select"
                        onChange={e =>
                            props.toggleDataset("degree", e.target.value, props.dataset.dataset_id)
                        }>
                        {props.degree.map((dataset, i) => {
                            return (
                                <option key={i} value={dataset.value}>
                                    {dataset.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
            {props.dataset_type == "DM" ? (
                <td>
                    <select
                        as="select"
                        onChange={e =>
                            props.toggleDataset(
                                "background",
                                e.target.value,
                                props.dataset.dataset_id
                            )
                        }>
                        {props.background.map((dataset, i) => {
                            return (
                                <option key={i} value={dataset.value}>
                                    {dataset.name}
                                </option>
                            );
                        })}
                    </select>
                </td>
            ) : null}
        </tr>
    );
};

Datasets.propTypes = {
    dataStore: PropTypes.object,
    saveAdverseDirection: PropTypes.func,
    toggleDataset: PropTypes.func,
    datasets: PropTypes.array,
    getDatasetType: PropTypes.func,
    adverseList: PropTypes.array,
    degree: PropTypes.array,
    background: PropTypes.array,
    dataset: PropTypes.object,
    dataset_type: PropTypes.string,
};
export default Datasets;
