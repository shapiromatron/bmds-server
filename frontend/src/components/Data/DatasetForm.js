import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import TabularDatasetModal from "./TabularDatasetModal";

import {columnHeaders, columns} from "../../constants/dataConstants";
import TextInput from "../common/TextInput";
import FloatInput from "../common/FloatInput";
import Button from "../common/Button";

const DatasetFormRow = props => {
    return (
        <tr>
            {props.columns.map((column, index) => {
                return (
                    <td key={index}>
                        <FloatInput
                            value={props.row[column]}
                            onChange={value => props.onChange(column, value, props.rowIdx)}
                        />
                    </td>
                );
            })}
            <td>
                <Button
                    className="btn btn-danger btn-sm"
                    onClick={e => props.delete(props.rowIdx)}
                    faClass="fa fa-fw fa-trash"
                />
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
                        <TextInput
                            value={dataset.metadata.name}
                            onChange={value => dataStore.setDatasetMetadata("name", value)}
                        />

                        <div className="input-group-append">
                            <Button
                                className="btn btn-danger btn-sm float-right ml-1"
                                onClick={dataStore.deleteDataset}
                                text="Delete"
                                faClass="fa fa-fw fa-trash"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group row mx-0">
                    <label htmlFor="doseName" className="col-md-2 px-0">
                        Dose name
                    </label>
                    <div className="col-md-4">
                        <TextInput
                            value={dataset.metadata.dose_name}
                            onChange={value => dataStore.setDatasetMetadata("dose_name", value)}
                        />
                    </div>
                    <label htmlFor="responseName" className="col-md-2 px-0">
                        Response name
                    </label>
                    <div className="col-md-4">
                        <TextInput
                            value={dataset.metadata.response_name}
                            onChange={value => dataStore.setDatasetMetadata("response_name", value)}
                        />
                    </div>
                </div>

                <div className="form-group row mx-0">
                    <label htmlFor="doseUnits" className="col-md-2 px-0">
                        Dose units
                    </label>
                    <div className="col-md-4">
                        <TextInput
                            value={dataset.metadata.dose_units}
                            onChange={value => dataStore.setDatasetMetadata("dose_units", value)}
                        />
                    </div>

                    <label htmlFor="responseUnits" className="col-md-2 px-0">
                        Response units
                    </label>
                    <div className="col-md-4">
                        <TextInput
                            value={dataset.metadata.response_units}
                            onChange={value =>
                                dataStore.setDatasetMetadata("response_units", value)
                            }
                        />
                    </div>
                </div>
                <table className="table table-sm text-center">
                    <thead>
                        <tr className="bg-custom text-center">
                            {columnNames.map((item, index) => (
                                <th key={index}>{columnHeaders[item]}</th>
                            ))}
                            <td style={{width: 100}}>
                                <Button
                                    className="btn btn-primary"
                                    title="Add row"
                                    onClick={dataStore.addRow}
                                    faClass="fa fa-plus-square"
                                    hidden="true"
                                />

                                <Button
                                    className="btn btn-info mr-1"
                                    title="Load dataset from Excel"
                                    onClick={dataStore.toggleDatasetModal}
                                    faClass="fa fa-file-excel-o"
                                    hidden="true"
                                />
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
                <p>
                    <Button
                        className="btn btn-link"
                        onClick={dataStore.loadExampleData}
                        faClass="fa fa-fw fa-upload mr-1"
                        text="Load an example dataset"
                    />
                </p>
                <TabularDatasetModal />
            </div>
        );
    }
}
DatasetForm.propTypes = {
    dataStore: PropTypes.object,
};
export default DatasetForm;
