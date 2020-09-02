import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class Datasets extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <tbody>
                {dataStore.datasets.map((dataset, index) => {
                    return [
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={dataset.enabled}
                                    onChange={e =>
                                        dataStore.toggleDataset(
                                            "enabled",
                                            e.target.checked,
                                            dataset.dataset_id
                                        )
                                    }
                                />
                            </td>
                            <td>{dataset.dataset_name}</td>
                            {dataStore.getDatasetType == "C" ? (
                                <td>
                                    {" "}
                                    <Form.Control
                                        as="select"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                "adverse_direction",
                                                e.target.value,
                                                dataset.dataset_id
                                            )
                                        }>
                                        {dataStore.getAdverseDirectionList.map((dataset, i) => {
                                            return [
                                                <option key={i} value={dataset.value}>
                                                    {dataset.name}
                                                </option>,
                                            ];
                                        })}
                                    </Form.Control>
                                </td>
                            ) : null}
                            {dataStore.getDatasetType == "DM" ? (
                                <td>
                                    {" "}
                                    <Form.Control
                                        as="select"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                "degree",
                                                e.target.value,
                                                dataset.dataset_id
                                            )
                                        }>
                                        {dataStore.getDegree.map((dataset, i) => {
                                            return [
                                                <option key={i} value={dataset.value}>
                                                    {dataset.name}
                                                </option>,
                                            ];
                                        })}
                                    </Form.Control>
                                </td>
                            ) : null}
                            {dataStore.getDatasetType == "DM" ? (
                                <td>
                                    <Form.Control
                                        as="select"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                "background",
                                                e.target.value,
                                                dataset.dataset_id
                                            )
                                        }>
                                        {dataStore.getBackground.map((dataset, i) => {
                                            return [
                                                <option key={i} value={dataset.value}>
                                                    {dataset.name}
                                                </option>,
                                            ];
                                        })}
                                    </Form.Control>
                                </td>
                            ) : null}
                        </tr>,
                    ];
                })}
            </tbody>
        );
    }
}

Datasets.propTypes = {
    dataStore: PropTypes.object,
    saveAdverseDirection: PropTypes.func,
    toggleDataset: PropTypes.func,
    datasets: PropTypes.array,
    getDatasetType: PropTypes.func,
    getAdverseDirectionList: PropTypes.func,
    getDegree: PropTypes.func,
    getBackground: PropTypes.string,
};
export default Datasets;
