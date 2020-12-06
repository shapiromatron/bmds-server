import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import {columnHeaders} from "../../constants/dataConstants";

const DatasetFormRow = props => {
    return (
        <tr>
            {props.columns.map((column, index) => {
                return (
                    <td key={index} className="inputform">
                        <input
                            type="number"
                            name={column}
                            value={props.row[column]}
                            onChange={e =>
                                props.onChange(column, e.target.value, props.dataset_id, props.idx)
                            }
                        />
                    </td>
                );
            })}
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={e => props.delete(props.dataset_id, props.idx)}>
                    <i className="fa fa-trash"></i>
                </button>
            </td>
        </tr>
    );
};
DatasetFormRow.propTypes = {
    columns: PropTypes.array.isRequired,
    row: PropTypes.object,
    onChange: PropTypes.func,
    dataset_id: PropTypes.number,
    idx: PropTypes.number,
    delete: PropTypes.func,
};

@inject("dataStore")
@observer
class DatasetForm extends Component {
    render() {
        const {dataStore} = this.props,
            columns = dataStore.getDatasetColumns,
            dataset = dataStore.selectedDataset;
        return (
            <>
                <div className="label">
                    <label>Dataset Name:</label>
                    <input
                        type="text"
                        name="dataset_name"
                        value={dataset.dataset_name}
                        onChange={e => dataStore.saveDatasetName("dataset_name", e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm float-right ml-1"
                        onClick={dataStore.deleteDataset}>
                        <i className="fa fa-fw fa-trash"></i>
                        Delete
                    </button>
                </div>
                <table className="inputformlist">
                    <thead>
                        <tr className="table-primary text-center">
                            {columns.map((item, index) => {
                                return <th key={index}>{columnHeaders[item]}</th>;
                            })}
                            <td>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => dataStore.addRows()}>
                                    <i className="fa fa-plus-square" aria-hidden="true"></i>{" "}
                                </button>
                            </td>
                        </tr>
                        <tr>
                            {columns.map((column, i) => {
                                return (
                                    <td key={i}>
                                        <input
                                            className="column-names"
                                            name={column}
                                            value={dataset.column_names[column]}
                                            onChange={e =>
                                                dataStore.changeColumnName(column, e.target.value)
                                            }
                                        />
                                    </td>
                                );
                            })}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataStore.getMappedArray.map((obj, i) => {
                            return (
                                <DatasetFormRow
                                    key={i}
                                    idx={i}
                                    columns={columns}
                                    row={obj}
                                    dataset_id={dataset.dataset_id}
                                    onChange={dataStore.saveDataset}
                                    delete={dataStore.deleteRow}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </>
        );
    }
}
DatasetForm.propTypes = {
    dataStore: PropTypes.object,
};
export default DatasetForm;
