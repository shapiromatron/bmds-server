import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import InputForm from "./InputForm";

@inject("DataStore")
@observer
class CSFormList extends Component {
    constructor(props) {
        super(props);
    }

    addRow = (e, form_type) => {
        e.preventDefault();
        this.props.DataStore.createForm(form_type);
    };

    onChange = e => {
        const {name, value, id} = e.target;
        let parsedValue = "";
        if (name === "ns") {
            parsedValue = parseInt(value);
        } else {
            parsedValue = parseFloat(value);
        }
        this.props.DataStore.saveRowData(name, parsedValue, id);
    };

    handleSubmit = e => {
        e.preventDefault();
        let dataset_name = e.target.dataset_name.value;
        this.props.DataStore.saveDataset(dataset_name);
    };

    deleteRow = (e, val) => {
        e.preventDefault();
        this.props.DataStore.deleteDataRow(val);
    };

    deleteForm = e => {
        this.props.DataStore.deleteForm();
    };

    render() {
        let form_type = this.props.DataStore.dataFormType;

        return (
            <div>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col">
                                <div className="card">
                                    <div className="card-header text-center">Add CS Dataset</div>
                                    <div className="card-header">
                                        <input
                                            type="text"
                                            name="dataset_name"
                                            placeholder="Enter dataset name"
                                        />
                                    </div>
                                    <div className="card-body ">
                                        <table className="table">
                                            <thead className="text-center">
                                                <tr>
                                                    <th>Doses</th>
                                                    <th>NS</th>
                                                    {form_type === "D" ? <th>Incidence</th> : null}
                                                    {form_type === "CS" ? <th>Means</th> : null}
                                                    {form_type === "CS" ? <th>St. Dev</th> : null}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.DataStore.datasets.map((item, id) => (
                                                    <InputForm
                                                        key={id}
                                                        idx={id}
                                                        form_type={form_type}
                                                        onChange={this.onChange}
                                                        delete={this.deleteRow.bind(this)}
                                                    />
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="3">
                                                        <button
                                                            onClick={e => this.addRow(e, form_type)}
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

export default CSFormList;
