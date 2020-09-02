import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import InputForm from "./InputForm";
import InputFormReadOnly from "./InputFormReadOnly";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class InputFormList extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div>
                {dataStore.getEditSettings ? (
                    <div>
                        <div className="label">
                            <label>Dataset Name:</label>
                            <input
                                type="text"
                                name="dataset_name"
                                value={dataStore.getCurrentDatasets.dataset_name}
                                onChange={e =>
                                    dataStore.saveDatasetName("dataset_name", e.target.value)
                                }
                            />
                        </div>
                        <table className="inputformlist">
                            <thead>
                                <tr className="table-primary text-center">
                                    {dataStore.getLabels.map((item, index) => {
                                        return [<th key={index}>{item}</th>];
                                    })}
                                    {dataStore.getEditSettings ? (
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-primary addrow"
                                                onClick={() => dataStore.addRows()}>
                                                <i
                                                    className="fa fa-plus-square"
                                                    aria-hidden="true"></i>{" "}
                                            </button>
                                        </td>
                                    ) : null}
                                </tr>
                                <tr>
                                    {Object.keys(dataStore.getCurrentDatasets.column_names).map(
                                        (columnName, i) => {
                                            return [
                                                <td key={i}>
                                                    <input
                                                        className="column-names"
                                                        name={columnName}
                                                        value={
                                                            dataStore.getCurrentDatasets
                                                                .column_names[columnName]
                                                        }
                                                        onChange={e =>
                                                            dataStore.changeColumnName(
                                                                columnName,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </td>,
                                            ];
                                        }
                                    )}
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody>
                                {dataStore.getMappedArray.map((obj, i) => {
                                    return [
                                        <InputForm
                                            key={i}
                                            idx={i}
                                            row={obj}
                                            dataset_id={dataStore.getCurrentDatasets.dataset_id}
                                            onChange={dataStore.saveDataset}
                                            delete={dataStore.deleteRow}
                                        />,
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <InputFormReadOnly
                        labels={dataStore.getLabels}
                        mappedDatasets={dataStore.getMappedArray}
                        currentDataset={dataStore.getCurrentDatasets}
                    />
                )}
            </div>
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
