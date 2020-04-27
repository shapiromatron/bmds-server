import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import "./dataform.css";

@inject("DataStore")
@observer
class DataForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: this.props.DataStore.getFormType(),
            CSDataset: [{doses: "", ns: "", means: "", stdevs: ""}],
            CIDataset: [{doses: "", response: ""}],
            DIDataset: [{doses: "", ns: "", incidence: ""}],
            NSDataset: [{doses: "", litterSize: "", incidence: "", lsc: ""}],
        };
    }

    renderTableData() {
        switch (this.state.formType) {
            case "CS":
                return this.state.CSDataset.map((dataset, index) => {
                    let doses = `doses-${index}`,
                        ns = `ns-${index}`,
                        means = `means-${index}`,
                        stdevs = `stdevs-${index}`;
                    return (
                        <tr key={index}>
                            <td>
                                <input
                                    name="doses"
                                    id={doses}
                                    data-id={index}
                                    type="number"
                                    pattern="[0-9]*"
                                    inputMode="numeric"></input>
                            </td>
                            <td>
                                <input
                                    name="ns"
                                    id={ns}
                                    data-id={index}
                                    type="number"
                                    pattern="[0-9]*"
                                    inputMode="numeric"></input>
                            </td>
                            <td>
                                <input
                                    name="means"
                                    id={means}
                                    data-id={index}
                                    type="number"
                                    pattern="[0-9]*"
                                    inputMode="numeric"></input>
                            </td>
                            <td>
                                <input
                                    name="stdevs"
                                    id={stdevs}
                                    data-id={index}
                                    type="number"
                                    pattern="[0-9]*"
                                    inputMode="numeric"></input>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger close"
                                    aria-label="Close"
                                    onClick={() => this.deleteRow(index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </td>
                        </tr>
                    );
                });
            case "CI":
                return this.state.CIDataset.map((dataset, index) => {
                    let doses = `doses-${index}`,
                        response = `response-${index}`;
                    return (
                        <tr key={index}>
                            <td>
                                <input name="doses" id={doses} data-id={index} type="text"></input>
                            </td>
                            <td>
                                <input
                                    name="response"
                                    id={response}
                                    data-id={index}
                                    type="text"></input>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger close"
                                    aria-label="Close"
                                    onClick={() => this.deleteRow(index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </td>
                        </tr>
                    );
                });
            case "DI":
                return this.state.DIDataset.map((dataset, index) => {
                    let doses = `doses-${index}`,
                        ns = `ns-${index}`,
                        incidence = `incidence-${index}`;
                    return (
                        <tr key={index}>
                            <td>
                                <input name="doses" id={doses} data-id={index} type="text"></input>
                            </td>
                            <td>
                                <input name="ns" id={ns} data-id={index} type="text"></input>
                            </td>
                            <td>
                                <input
                                    name="incidence"
                                    id={incidence}
                                    data-id={index}
                                    type="text"></input>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger close"
                                    aria-label="Close"
                                    onClick={() => this.deleteRow(index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </td>
                        </tr>
                    );
                });
            case "NS":
                return this.state.NSDataset.map((dataset, index) => {
                    let doses = `doses-${index}`,
                        litterSize = `litterSize-${index}`,
                        incidence = `incidence-${index}`,
                        lsc = `lsc-${index}`;
                    return (
                        <tr key={index}>
                            <td>
                                <input name="doses" id={doses} data-id={index} type="text"></input>
                            </td>
                            <td>
                                <input
                                    name="litterSize"
                                    id={litterSize}
                                    data-id={index}
                                    type="text"></input>
                            </td>
                            <td>
                                <input
                                    name="incidence"
                                    id={incidence}
                                    data-id={index}
                                    type="text"></input>
                            </td>
                            <td>
                                <input name="lsc" id={lsc} data-id={index} type="text"></input>
                            </td>
                            <td>
                                <button
                                    className="btn btn-danger close"
                                    aria-label="Close"
                                    onClick={() => this.deleteRow(index)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </td>
                        </tr>
                    );
                });
        }
    }

    renderTableHeader() {
        if (this.state.formType.toString() === "CS") {
            let csheader = Object.keys(this.state.CSDataset[0]);
            return csheader.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>;
            });
        }
        if (this.state.formType.toString() === "CI") {
            let ciheader = Object.keys(this.state.CIDataset[0]);
            return ciheader.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>;
            });
        }
        if (this.state.formType.toString() === "DI") {
            let diheader = Object.keys(this.state.DIDataset[0]);
            return diheader.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>;
            });
        }

        if (this.state.formType.toString() === "NS") {
            let nsheader = Object.keys(this.state.NSDataset[0]);
            return nsheader.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>;
            });
        }
    }

    addNewRow = e => {
        switch (this.state.formType) {
            case "CS":
                this.setState(prevState => ({
                    CSDataset: [...prevState.CSDataset, {doses: "", ns: "", means: "", stdevs: ""}],
                }));
                break;
            case "CI":
                this.setState(prevState => ({
                    CIDataset: [...prevState.CIDataset, {doses: "", response: ""}],
                }));
                break;
            case "DI":
                this.setState(prevState => ({
                    DIDataset: [...prevState.DIDataset, {doses: "", ns: "", incidence: ""}],
                }));
                break;
            case "NS":
                this.setState(prevState => ({
                    NSDataset: [
                        ...prevState.NSDataset,
                        {doses: "", litterSize: "", incidence: "", lsc: ""},
                    ],
                }));
        }
    };

    deleteRow = index => {
        switch (this.state.formType) {
            case "CS":
                this.setState({
                    CSDataset: this.state.CSDataset.filter((s, sindex) => index !== sindex),
                });
                break;
            case "CI":
                this.setState({
                    CIDataset: this.state.CIDataset.filter((s, sindex) => index !== sindex),
                });
                break;
            case "DI":
                this.setState({
                    DIDataset: this.state.DIDataset.filter((s, sindex) => index !== sindex),
                });
                break;
            case "NS":
                this.setState({
                    NSDataset: this.state.NSDataset.filter((s, sindex) => index !== sindex),
                });
        }
    };

    handleChange = e => {
        if (this.state.formType.toString() === "CS") {
            if (["doses", "ns", "means", "stdevs"].includes(e.target.name)) {
                let CSDataset = [...this.state.CSDataset];
                CSDataset[e.target.dataset.id][e.target.name] = parseInt(e.target.value);
            } else {
                this.setState({[e.target.name]: e.target.value});
            }
        }
        if (this.state.formType.toString() === "CI") {
            if (["doses", "response"].includes(e.target.name)) {
                let CIDataset = [...this.state.CIDataset];
                CIDataset[e.target.dataset.id][e.target.name] = parseInt(e.target.value);
            } else {
                this.setState({[e.target.name]: e.target.value});
            }
        }
        if (this.state.formType.toString() === "DI") {
            if (["doses", "ns", "incidence"].includes(e.target.name)) {
                let DIDataset = [...this.state.DIDataset];
                DIDataset[e.target.dataset.id][e.target.name] = parseInt(e.target.value);
            } else {
                this.setState({[e.target.name]: e.target.value});
            }
        }
        if (this.state.formType.toString() === "NS") {
            if (["doses", "litterSize", "incidence", "lsc"].includes(e.target.name)) {
                let NSDataset = [...this.state.NSDataset];
                NSDataset[e.target.dataset.id][e.target.name] = parseInt(e.target.value);
            } else {
                this.setState({[e.target.name]: e.target.value});
            }
        }
    };

    handleSubmit = e => {
        e.preventDefault();
        if (this.state.formType.toString() === "CS") {
            let data = {
                id: Math.floor(Math.random() * 1000),
                dataset_name: e.target.datasetname.value,
                dataset: this.state.CSDataset,
            };
            this.props.DataStore.addDataSets(data);
        } else if (this.state.formType.toString() === "CI") {
            let data = {
                id: Math.floor(Math.random() * 1000),
                dataset_name: e.target.datasetname.value,
                dataset: this.state.CIDataset,
            };
            this.props.DataStore.addDataSets(data);
        } else if (this.state.formType.toString() === "DI") {
            let data = {
                id: Math.floor(Math.random() * 1000),
                dataset_name: e.target.datasetname.value,
                dataset: this.state.DIDataset,
            };
            this.props.DataStore.addDataSets(data);
        } else if (this.state.formType.toString() === "NS") {
            let data = {
                id: Math.floor(Math.random() * 1000),
                dataset_name: e.target.datasetname.value,
                dataset: this.state.NSDataset,
            };
            this.props.DataStore.addDataSets(data);
        }
    };

    deleteForm = e => {
        this.props.DataStore.deleteDataForm();
    };
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} onChange={e => this.handleChange(e)}>
                    <div className="row" style={{marginTop: 20}}>
                        <div className="col">
                            <div className="card">
                                <div className="card-header text-center">
                                    Add {this.state.formType} Dataset
                                </div>
                                <div className="card-header">
                                    <input
                                        type="text"
                                        name="datasetname"
                                        placeholder="Enter dataset name"
                                    />
                                </div>
                                <div className="card-body ">
                                    <table className="table">
                                        <thead className="text-center">
                                            <tr>{this.renderTableHeader()}</tr>
                                        </thead>
                                        <tbody>{this.renderTableData()}</tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3">
                                                    <button
                                                        onClick={this.addNewRow}
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
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default DataForm;
