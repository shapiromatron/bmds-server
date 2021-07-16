import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import TabularDatasetModal from "./TabularDatasetModal";

import {columnHeaders, columns} from "../../constants/dataConstants";

const DatasetFormRow = props => {
    return (
        <tr>
            {props.columns.map((column, index) => {
                return (
                    <td key={index}>
                        <input
                            className="text-center form-control"
                            type="number"
                            name={column}
                            value={props.row[column]}
                            onChange={e => props.onChange(column, e.target.value, props.rowIdx)}
                        />
                    </td>
                );
            })}
            <td>
                <button className="btn btn-danger btn-sm" onClick={e => props.delete(props.rowIdx)}>
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
    rowIdx: PropTypes.number,
    delete: PropTypes.func,
};

@inject("dataStore")
@observer
class DatasetForm extends Component {
    render() {
        const {dataStore} = this.props,
            dataset = dataStore.selectedDataset,
            columnNames = columns[dataset.dtype];

        return (
            <div className="container-fluid">
                <div className="form-group row mx-0">
                    <label htmlFor="datasetName" className="col-md-3 px-0">
                        Dataset name
                    </label>
                    <div className="input-group col-md-9">
                        <input
                            id="datasetName"
                            type="text"
                            className="form-control"
                            value={dataset.metadata.name}
                            onChange={e => dataStore.setDatasetMetadata("name", e.target.value)}
                        />
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-danger float-right ml-1"
                                onClick={dataStore.deleteDataset}>
                                <i className="fa fa-fw fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="form-group row mx-0">
                    <label htmlFor="doseName" className="col-md-2 px-0">
                        Dose name
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            id="doseName"
                            value={dataset.metadata.dose_name}
                            onChange={e =>
                                dataStore.setDatasetMetadata("dose_name", e.target.value)
                            }
                        />
                    </div>
                    <label htmlFor="responseName" className="col-md-2 px-0">
                        Response name
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            id="responseName"
                            value={dataset.metadata.response_name}
                            onChange={e =>
                                dataStore.setDatasetMetadata("response_name", e.target.value)
                            }
                        />
                    </div>
                </div>

                <div className="form-group row mx-0">
                    <label htmlFor="doseUnits" className="col-md-2 px-0">
                        Dose units
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            id="doseUnits"
                            value={dataset.metadata.dose_units}
                            onChange={e =>
                                dataStore.setDatasetMetadata("dose_units", e.target.value)
                            }
                        />
                    </div>

                    <label htmlFor="responseUnits" className="col-md-2 px-0">
                        Response units
                    </label>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            id="responseUnits"
                            value={dataset.metadata.response_units}
                            onChange={e =>
                                dataStore.setDatasetMetadata("response_units", e.target.value)
                            }
                        />
                    </div>
                </div>
                <button
                    className="btn btn-sm btn-warning"
                    onClick={() => dataStore.loadExampleData()}>
                    load example data
                </button>

                <table className="table table-sm text-center">
                    <thead>
                        <tr className="bg-custom text-center">
                            {columnNames.map((item, index) => (
                                <th key={index}>{columnHeaders[item]}</th>
                            ))}
                            <td style={{width: 100}}>
                                <button
                                    className="btn btn-info mr-1"
                                    title="Load dataset from Excel"
                                    onClick={() => dataStore.toggleDatasetModal()}>
                                    <i className="fa fa-file-excel-o"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    title="Add row"
                                    onClick={() => dataStore.addRow()}>
                                    <i className="fa fa-plus-square" aria-hidden="true"></i>{" "}
                                </button>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        {dataStore.getMappedArray.map((obj, i) => {
                            return (
                                <DatasetFormRow
                                    key={i}
                                    rowIdx={i}
                                    columns={columnNames}
                                    row={obj}
                                    onChange={dataStore.saveDatasetCellItem}
                                    delete={dataStore.deleteRow}
                                />
                            );
                        })}
                    </tbody>
                </table>
                <TabularDatasetModal />
            </div>
        );
    }
}
DatasetForm.propTypes = {
    dataStore: PropTypes.object,
};
export default DatasetForm;
