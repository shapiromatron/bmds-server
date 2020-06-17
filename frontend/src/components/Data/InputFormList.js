import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import InputForm from "./InputForm";
import InputFormReadOnly from "./InputFormReadOnly";

@inject("dataStore")
@observer
class InputFormList extends Component {
    render() {
        const {dataStore} = this.props,
            deleteRow = (e, dataset_id, index) => {
                e.preventDefault();
                dataStore.deleteRow(dataset_id, index);
            },
            onChange = (e, dataset_id, index) => {
                e.preventDefault();
                const {name, value} = e.target;
                let parsedValue = "";
                if (Number(value) || value == "0") {
                    if (name === "ns") {
                        parsedValue = parseInt(value);
                    } else {
                        parsedValue = parseFloat(value);
                    }
                } else {
                    parsedValue = value;
                }
                dataStore.saveDataset(name, parsedValue, index, dataset_id);
            },
            selectedIndex = dataStore.selectedDatasetIndex,
            currentDataset = dataStore.getCurrentDataset(selectedIndex),
            labels = dataStore.getDatasetLabels(currentDataset.model_type),
            datasetInputForm = [],
            isEditSettings = dataStore.getEditSettings();
        Object.keys(currentDataset).map(key => {
            if (Array.isArray(currentDataset[key])) {
                currentDataset[key].map((val, i) => {
                    if (!datasetInputForm[i]) {
                        datasetInputForm.push({[key]: val});
                    } else {
                        datasetInputForm[i][key] = val;
                    }
                });
            }
        });
        return (
            <div className="col col-sm-4">
                <div>
                    <div className="border border-light">
                        <label style={{marginRight: "20px"}}>Dataset Name:</label>
                        {isEditSettings ? (
                            <input
                                type="text"
                                name="dataset_name"
                                value={currentDataset.dataset_name}
                                onChange={e => onChange(e, currentDataset.dataset_id)}
                            />
                        ) : (
                            currentDataset.dataset_name
                        )}
                    </div>

                    <table className="table table-bordered">
                        <thead className="text-center">
                            <tr>
                                {labels.map((item, index) => {
                                    return [<th key={index}>{item.label}</th>];
                                })}
                                {isEditSettings ? (
                                    <td>
                                        <button
                                            type="submit"
                                            className="btn btn-primary sm-1"
                                            onClick={() => dataStore.addRows(currentDataset)}>
                                            Add Row
                                        </button>
                                    </td>
                                ) : null}
                            </tr>
                        </thead>
                        {isEditSettings ? (
                            <tbody>
                                {datasetInputForm.map((obj, i) => {
                                    return [
                                        <InputForm
                                            key={i}
                                            idx={i}
                                            row={obj}
                                            dataset_id={currentDataset.dataset_id}
                                            onChange={onChange}
                                            delete={deleteRow.bind(this)}
                                        />,
                                    ];
                                })}
                            </tbody>
                        ) : (
                            <tbody>
                                {datasetInputForm.map((obj, i) => {
                                    return [<InputFormReadOnly key={i} row={obj} />];
                                })}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>
        );
    }
}

export default InputFormList;
