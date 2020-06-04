import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("store")
@observer
class InputButtons extends Component {
    onChange = e => {
        this.props.store.model_type = e.target.value;
    };
    render() {
        const {store} = this.props;
        return (
            <div className="col col-sm-4">
                <div>
                    <form>
                        <label htmlFor="selectmodel">Select Model Type</label>
                        <select
                            className="form-control"
                            id="selectmodel"
                            style={{maxWidth: "70%"}}
                            onChange={this.onChange}>
                            {store.DatasetTypes.map((item, i) => {
                                return [
                                    <option key={i} value={item.value}>
                                        {item.name}
                                    </option>,
                                ];
                            })}
                        </select>
                        <div className="btn-toolbar">
                            <button
                                type="submit"
                                className="btn btn-primary btn-xs btn-space"
                                onClick={() => store.createForm()}>
                                Add Dataset
                            </button>
                            <div className="btn btn-primary btn-file">
                                Import Dataset <input type="file" />
                            </div>
                        </div>
                    </form>
                </div>
                {store.datasets.length ? (
                    <div className="editdataset">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Edit Dataset</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.datasets.map((item, index) => {
                                    return [
                                        <tr key={index}>
                                            <td>
                                                <a
                                                    className="currentdataset"
                                                    onClick={() =>
                                                        store.setCurrentDatasetIndex(
                                                            item.dataset_id
                                                        )
                                                    }>
                                                    {item.dataset_name}
                                                </a>
                                            </td>
                                        </tr>,
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : null}
                {store.datasets.length ? (
                    <div>
                        <button className="btn btn-danger" onClick={() => store.deleteDataset()}>
                            Delete Dataset
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default InputButtons;
