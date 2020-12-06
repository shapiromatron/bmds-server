import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetTable extends Component {
    render() {
        const {dataStore} = this.props,
            columns = dataStore.getDatasetColumns,
            dataset = dataStore.getCurrentDatasets,
            width = `${100 / columns.length}%`;
        return (
            <>
                <div className="label">
                    <label style={{marginRight: "20px"}}>Dataset Name:</label>
                    {dataset.dataset_name}
                </div>
                <div className="table-responsive-sm">
                    <table className="table table-bordered table-sm">
                        <colgroup>
                            {columns.map((_, i) => {
                                return <col key={i} width={width}></col>;
                            })}
                        </colgroup>
                        <thead className="table-primary">
                            <tr>
                                {columns.map((column, i) => {
                                    return <th key={i}>{dataset.column_names[column]}</th>;
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {dataStore.getMappedArray.map((row, i) => {
                                return (
                                    <tr key={i}>
                                        {columns.map((column, index) => {
                                            return <td key={index}>{row[column]}</td>;
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}
DatasetTable.propTypes = {
    dataStore: PropTypes.object,
    currentDataset: PropTypes.object,
    dataset_name: PropTypes.string,
    column_names: PropTypes.array,
    mappedDatasets: PropTypes.array,
    labels: PropTypes.array,
    getCurrentDatasets: PropTypes.func,
};
export default DatasetTable;