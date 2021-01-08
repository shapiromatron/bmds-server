import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {columns, columnHeaders} from "../../constants/dataConstants";

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
                    {dataset.metadata.name}
                </div>

                <table className="table table-bordered table-sm">
                    <colgroup>
                        {_.range(columnNames).map(i => (
                            <col key={i} width={width}></col>
                        ))}
                    </colgroup>
                    <thead className="table-primary">
                        <tr>
                            {columnNames.map((column, i) => {
                                return <th key={i}>{columnHeaders[column]}</th>;
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
