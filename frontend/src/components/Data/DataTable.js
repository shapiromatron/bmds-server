import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("DataStore")
@observer
class DataTable extends Component {
    constructor(props) {
        super(props);
    }

    delete = id => {
        this.props.DataStore.deleteDataset(id);
    };

    render() {
        return (
            <div>
                <div></div>
                <div>
                    {this.props.DataStore.getDataLength > 0 ? (
                        <div className="row" style={{marginTop: 20}}>
                            <div className="col-md-6 column">
                                {this.props.DataStore.savedDataset.map((item, index) => (
                                    <div key={index}>
                                        <table className="table table-bordered">
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
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>Dose</th>
                                                    {item.doses.map((dev, index) => {
                                                        return [<td key={index}>{dev}</td>];
                                                    })}
                                                </tr>
                                                <tr>
                                                    <th>N</th>
                                                    {item.ns.map((dev, index) => {
                                                        return [<td key={index}>{dev}</td>];
                                                    })}
                                                </tr>
                                                {item.model_type === "CS" ? (
                                                    <tr>
                                                        <th>Mean</th>
                                                        {item.means.map((dev, index) => {
                                                            return [<td key={index}>{dev}</td>];
                                                        })}
                                                    </tr>
                                                ) : null}
                                                {item.model_type === "CS" ? (
                                                    <tr>
                                                        <th>St Dev</th>
                                                        {item.stdevs.map((dev, index) => {
                                                            return [<td key={index}>{dev}</td>];
                                                        })}
                                                    </tr>
                                                ) : null}
                                                {item.model_type === "D" ? (
                                                    <tr>
                                                        <th>Incidence</th>
                                                        {item.incidences.map((dev, index) => {
                                                            return [<td key={index}>{dev}</td>];
                                                        })}
                                                    </tr>
                                                ) : null}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
}

export default DataTable;
