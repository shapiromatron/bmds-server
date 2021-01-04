import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {columns} from "../../constants/dataConstants";

@observer
class DatasetTable extends Component {
    render() {
        const {dataset} = this.props,
            columnNames = columns[dataset.model_type],
            width = `${100 / columnNames.length}%`;

        return (
            <>
                <div className="label">
                    <label style={{marginRight: "20px"}}>Dataset Name:</label>
                    {dataset.dataset_name}
                </div>

                <table className="table table-bordered table-sm">
                    <colgroup>
                        {columnNames.map((_, i) => {
                            return <col key={i} width={width}></col>;
                        })}
                    </colgroup>
                    <thead className="table-primary">
                        <tr>
                            {columnNames.map((column, i) => {
                                return <th key={i}>{dataset.column_names[column]}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {_.range(dataset.doses.length).map(rowIdx => {
                            return (
                                <tr key={rowIdx}>
                                    {columnNames.map((column, colIdx) => {
                                        return <td key={colIdx}>{dataset[column][rowIdx]}</td>;
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
    dataset: PropTypes.object.isRequired,
};
export default DatasetTable;
