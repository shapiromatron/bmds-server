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
                {dataStore.datasets.map((item, index) => {
                    return [
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    name="isIncluded"
                                    checked={item.enabled}
                                    onChange={e => dataStore.toggleDataset(item.dataset_id)}
                                />
                            </td>
                            <td>{item.dataset_name}</td>
                            {dataStore.getDatasetType == "C" ? (
                                <td>
                                    {" "}
                                    <Form.Control
                                        as="select"
                                        name="adverse_direction"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                e.target.name,
                                                e.target.value,
                                                item.dataset_id
                                            )
                                        }>
                                        {dataStore.getAdverseDirectionList.map((item, i) => {
                                            return [
                                                <option key={i} value={item.value}>
                                                    {item.name}
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
                                        name="degree"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                e.target.name,
                                                e.target.value,
                                                item.dataset_id
                                            )
                                        }>
                                        {dataStore.getDegree.map((item, i) => {
                                            return [
                                                <option key={i} value={item.value}>
                                                    {item.name}
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
                                        name="background"
                                        onChange={e =>
                                            dataStore.changeDatasetProperties(
                                                e.target.name,
                                                e.target.value,
                                                item.dataset_id
                                            )
                                        }>
                                        {dataStore.getBackground.map((item, i) => {
                                            return [
                                                <option key={i} value={item.value}>
                                                    {item.name}
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
