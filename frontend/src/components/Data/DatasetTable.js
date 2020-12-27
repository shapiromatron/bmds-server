import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetTable extends Component {
    render() {
        const {store} = this.props,
            columns = store.getDatasetColumns,
            width = `${100 / columns.length}%`;

        return (
            <>
                <div className="label">
                    <label style={{marginRight: "20px"}}>Dataset Name:</label>
                    {store.selectedDataset.dataset_name}
                </div>

                <table className="table table-bordered table-sm">
                    <colgroup>
                        {columns.map((_, i) => {
                            return <col key={i} width={width}></col>;
                        })}
                    </colgroup>
                    <thead className="table-primary">
                        <tr>
                            {columns.map((column, i) => {
                                return (
                                    <th key={i}>{store.selectedDataset.column_names[column]}</th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {store.getMappedArray.map((row, i) => {
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
            </>
        );
    }
}
DatasetTable.propTypes = {
    dataStore: PropTypes.object,
    store: PropTypes.object,
};
export default DatasetTable;
