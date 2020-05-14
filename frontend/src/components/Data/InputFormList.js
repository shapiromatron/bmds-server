import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import InputForm from "./InputForm";
import {toJS} from "mobx";

@inject("DataStore")
@observer
class InputFormList extends Component {
    constructor(props) {
        super(props);
    }

    addRow = (e, model_type) => {
        e.preventDefault();
        this.props.DataStore.createForm(model_type);
    };

    onChange = e => {
        const {name, value, id} = e.target;
        let parsedValue = "";
        if (name === "dataset_name") {
            parsedValue = value;
        } else if (name === "ns") {
            parsedValue = parseInt(value);
        } else {
            parsedValue = parseFloat(value);
        }

        this.props.DataStore.saveRowData(name, parsedValue, id);
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.DataStore.saveDataset();
    };

    deleteRow = (e, val) => {
        e.preventDefault();
        this.props.DataStore.deleteDataRow(val);
    };

    deleteForm = e => {
        e.preventDefault();
        this.props.DataStore.deleteForm();
    };

    render() {
        let model_type = this.props.DataStore.inputForm.model_type;
        let dataFormList = this.props.DataStore.getDataFormList(model_type);
        let datasets = toJS(this.props.DataStore.inputForm.datasets);
        return (
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col">
                                <div className="card">
                                    <div className="card-header text-center">
                                        Add {model_type} Dataset
                                    </div>
                                    <div className="card-header">
                                        <input
                                            type="text"
                                            name="dataset_name"
                                            placeholder="Enter dataset name"
                                            value={this.props.DataStore.inputForm.dataset_name}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="card-body ">
                                        <table className="table">
                                            <thead className="text-center">
                                                <tr>
                                                    {dataFormList.map((item, index) => {
                                                        return [<th key={index}>{item.label}</th>];
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {datasets.map((dataset, id) => (
                                                    <InputForm
                                                        key={id}
                                                        idx={id}
                                                        dataset={dataset}
                                                        form={dataFormList}
                                                        onChange={this.onChange}
                                                        delete={this.deleteRow.bind(this)}
                                                    />
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="3">
                                                        <button
                                                            onClick={e =>
                                                                this.addRow(e, model_type)
                                                            }
                                                            type="button"
                                                            className="btn btn-primary float-left">
                                                            Add New Row
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary text-center"
                                            style={{marginRight: "10px"}}>
                                            save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={this.deleteForm}
                                            className="btn btn-danger text-center">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default InputFormList;
