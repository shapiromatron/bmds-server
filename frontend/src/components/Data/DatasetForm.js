import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

const DatasetFormRow = props => {
    return (
        <tr>
            {Object.keys(props.row).map((key, index) => {
                return (
                    <td key={index} className="inputform">
                        <input
                            type="number"
                            name={key}
                            value={props.row[key]}
                            onChange={e =>
                                props.onChange(key, e.target.value, props.dataset_id, props.idx)
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
    row: PropTypes.object,
    onChange: PropTypes.func,
    dataset_id: PropTypes.number,
    idx: PropTypes.number,
    delete: PropTypes.func,
};

@inject("dataStore")
@observer
class InputFormList extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <>
                <div className="label">
                    <label>Dataset Name:</label>
                    <input
                        type="text"
                        name="dataset_name"
                        value={dataStore.getCurrentDatasets.dataset_name}
                        onChange={e => dataStore.saveDatasetName("dataset_name", e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={dataStore.deleteDataset}>
                        <i className="fa fa-fw fa-trash"></i>
                        Delete
                    </button>
                </div>
                <table className="inputformlist">
                    <thead>
                        <tr className="table-primary text-center">
                            {dataStore.getLabels.map((item, index) => {
                                return <th key={index}>{item}</th>;
                            })}
                            {dataStore.getEditSettings ? (
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => dataStore.addRows()}>
                                        <i className="fa fa-plus-square" aria-hidden="true"></i>{" "}
                                    </button>
                                </td>
                            ) : null}
                        </tr>
                        <tr>
                            {Object.keys(dataStore.getCurrentDatasets.column_names).map(
                                (columnName, i) => {
                                    return (
                                        <td key={i}>
                                            <input
                                                className="column-names"
                                                name={columnName}
                                                value={
                                                    dataStore.getCurrentDatasets.column_names[
                                                        columnName
                                                    ]
                                                }
                                                onChange={e =>
                                                    dataStore.changeColumnName(
                                                        columnName,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    );
                                }
                            )}
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataStore.getMappedArray.map((obj, i) => {
                            return (
                                <DatasetFormRow
                                    key={i}
                                    idx={i}
                                    row={obj}
                                    dataset_id={dataStore.getCurrentDatasets.dataset_id}
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
InputFormList.propTypes = {
    dataStore: PropTypes.object,
    deleteRow: PropTypes.func,
    saveDataset: PropTypes.func,
    changeColumnName: PropTypes.func,
    getEditSettings: PropTypes.func,
    getCurrentDatasets: PropTypes.func,
    dataset_name: PropTypes.string,
    saveDatasetName: PropTypes.func,
    getLabels: PropTypes.func,
    addRows: PropTypes.func,
    column_names: PropTypes.array,
    dataset_id: PropTypes.number,
    getMappedArray: PropTypes.func,
};
export default InputFormList;
