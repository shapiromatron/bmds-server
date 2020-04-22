import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: this.props.DataStore.getFormType().toString(),
        };
    }

    delete(id, e) {
        this.props.DataStore.deleteDataset(id);
    }

    render() {
        return (
            <div>
                {this.props.DataStore.getDataLength > 0 ? (
                    <div className="row" style={{marginTop: 20}}>
                        <div className="col-md-6 column">
                            {this.props.DataStore.datasets.map((item, index) => (
                                <table className="table table-bordered" key={index}>
                                    <thead>
                                        <tr>
                                            <th>
                                                {item.dataset_name}
                                                <button
                                                    className="btn btn-danger close"
                                                    aria-label="Close"
                                                    onClick={() => this.delete(item.id)}>
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className="text-center"> Dose </th>
                                            {this.state.formType === "CS" ||
                                            this.state.formType === "DI" ? (
                                                <th className="text-center"> N </th>
                                            ) : null}
                                            {this.state.formType === "CS" ? (
                                                <th className="text-center"> Mean </th>
                                            ) : null}
                                            {this.state.formType === "CS" ? (
                                                <th className="text-center"> St Dev </th>
                                            ) : null}
                                            {this.state.formType === "CI" ? (
                                                <th className="text-center"> Response </th>
                                            ) : null}
                                            {this.state.formType === "NS" ? (
                                                <th className="text-center"> Litter Size </th>
                                            ) : null}
                                            {this.state.formType === "DI" ||
                                            this.state.formType === "NS" ? (
                                                <th className="text-center"> Incidence </th>
                                            ) : null}
                                            {this.state.formType === "NS" ? (
                                                <th className="text-center"> LSC </th>
                                            ) : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.dataset.map((dev, index) => {
                                            return [
                                                <tr key={index}>
                                                    <td>{dev.doses}</td>
                                                    {dev.ns != null ? <td>{dev.ns}</td> : null}
                                                    {dev.means != null ? (
                                                        <td>{dev.means}</td>
                                                    ) : null}
                                                    {dev.stdevs != null ? (
                                                        <td>{dev.stdevs}</td>
                                                    ) : null}
                                                    {dev.response != null ? (
                                                        <td>{dev.response}</td>
                                                    ) : null}
                                                    {dev.litterSize != null ? (
                                                        <td>{dev.litterSize}</td>
                                                    ) : null}
                                                    {dev.incidence != null ? (
                                                        <td>{dev.incidence}</td>
                                                    ) : null}
                                                    {dev.lsc != null ? <td>{dev.lsc}</td> : null}
                                                </tr>,
                                            ];
                                        })}
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default DataTable;
