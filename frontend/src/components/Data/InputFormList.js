import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import InputForm from "./InputForm";

@inject("store")
@observer
class InputFormList extends Component {
    deleteRow = (e, dataset_id, index) => {
        e.preventDefault();
        this.props.store.deleteRow(dataset_id, index);
    };
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
        this.props.store.saveDataset(name, parsedValue, index, dataset_id);
    };
    render() {
        const {store} = this.props;

        let selectedIndex = store.selectedDatasetIndex;
        let currentDataset = store.getCurrentDataset(selectedIndex);
        let labels = store.getDatasetLabels(currentDataset.model_type);
        let datasetInputForm = [];
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
                    <label>Dataset Name</label>
                    <br />
                    <input
                        type="text"
                        name="dataset_name"
                        value={currentDataset.dataset_name}
                        onChange={e => this.onChange(e, currentDataset.dataset_id)}
                    />
                    <table className="table table-bordered">
                        <thead className="text-center">
                            <tr>
                                {labels.map((item, index) => {
                                    return [<th key={index}>{item.label}</th>];
                                })}
                                <td>
                                    <button
                                        type="submit"
                                        className="btn btn-primary sm-1"
                                        onClick={() => store.addRows(currentDataset)}>
                                        Add Row
                                    </button>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {datasetInputForm.map((obj, i) => {
                                return [
                                    <InputForm
                                        key={i}
                                        idx={i}
                                        row={obj}
                                        dataset_id={currentDataset.dataset_id}
                                        onChange={this.onChange}
                                        delete={this.deleteRow.bind(this)}
                                    />,
                                ];
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default InputFormList;
