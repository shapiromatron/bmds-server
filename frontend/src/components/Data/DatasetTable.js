import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {columns, columnHeaders} from "../../constants/dataConstants";
import {Dtype} from "../../constants/dataConstants";

@observer
class DatasetTable extends Component {
    render() {
        const {dataset} = this.props,
            columnNames = columns[dataset.dtype],
            width = `${100 / columnNames.length}%`,
            dose_group = _.uniq(dataset.doses),
            data_array = [];
        dataset.doses.map((dose, i) => {
            let obj = {};
            obj["dose"] = dose;
            obj["response"] = dataset.responses[i];
            data_array.push(obj);
        });
        let grouped_data = _.groupBy(data_array, d => d.dose);
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
                    <thead className="bg-custom">
                        <tr>
                            {columnNames.map((column, i) => {
                                return <th key={i}>{columnHeaders[column]}</th>;
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {dataset.dtype === Dtype.CONTINUOUS_INDIVIDUAL
                            ? _.range(dose_group.length).map(rowIdx => {
                                  return (
                                      <tr key={rowIdx}>
                                          <td>{dose_group[rowIdx]}</td>
                                          <td>
                                              {grouped_data[dose_group[rowIdx]]
                                                  .map(function(el) {
                                                      return el.response;
                                                  })
                                                  .join(" , ")}
                                          </td>
                                      </tr>
                                  );
                              })
                            : _.range(dataset.doses.length).map(rowIdx => {
                                  return (
                                      <tr key={rowIdx}>
                                          {columnNames.map((column, colIdx) => {
                                              return (
                                                  <td key={colIdx}>{dataset[column][rowIdx]}</td>
                                              );
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
