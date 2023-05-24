import _ from "lodash";
import PropTypes from "prop-types";
import React from "react";

const DataFrameTable = function({data, columns, formatters}) {
    const nrows = data[columns[0]].length;
    return (
        <table className="table table-sm table-striped table-hover">
            <thead>
                <tr>
                    {columns.map((column, i) => (
                        <th key={i}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {_.range(nrows).map(i => {
                    return (
                        <tr key={i}>
                            {columns.map((column, j) => (
                                <td key={j}>
                                    {formatters[column]
                                        ? formatters[column](data[column][i])
                                        : data[column][i]}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
DataFrameTable.propTypes = {
    data: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string.isRequired),
    formatters: PropTypes.object,
};
DataFrameTable.defaultProps = {
    formatters: {},
};
export default DataFrameTable;
