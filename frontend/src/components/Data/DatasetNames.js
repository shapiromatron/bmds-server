import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetNames extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div>
                <div className="editdataset">
                    <table className="table table-bordered table-hover table-sm">
                        <thead>
                            <tr className="table-primary">
                                <th colSpan="2">Datasets</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataStore.datasets.map((item, index) => {
                                return [
                                    <tr key={index} className="currentdataset">
                                        <td>{index + 1}</td>
                                        <td>
                                            <a
                                                onClick={() =>
                                                    dataStore.setCurrentDatasetIndex(
                                                        item.dataset_id
                                                    )
                                                }>
                                                {item.dataset_name}
                                            </a>
                                        </td>
                                    </tr>,
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
                {dataStore.getEditSettings ? (
                    <div>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => dataStore.deleteDataset()}>
                            Delete Dataset
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}
DatasetNames.propTypes = {
    dataStore: PropTypes.object,
    datasets: PropTypes.array,
    setCurrentDatasetIndex: PropTypes.func,
    getEditSettings: PropTypes.func,
    deleteDataset: PropTypes.func,
};
export default DatasetNames;
