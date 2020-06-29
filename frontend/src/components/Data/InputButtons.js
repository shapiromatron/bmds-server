import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("dataStore")
@observer
class InputButtons extends Component {
    render() {
        const {dataStore} = this.props,
            onChange = e => {
                dataStore.model_type = e.target.value;
            },
            isEditSettings = dataStore.getEditSettings();
        return (
            <div className="col col-sm-3">
                {isEditSettings ? (
                    <div>
                        <form className="model-type">
                            <div className="form-group">
                                <label htmlFor="selectmodel">Select Model Type</label>
                                <select
                                    className="form-control"
                                    id="selectmodel"
                                    onChange={onChange}>
                                    {dataStore.ModelTypes.map((item, i) => {
                                        return [
                                            <option key={i} value={item.value}>
                                                {item.name}
                                            </option>,
                                        ];
                                    })}
                                </select>
                            </div>
                            <div className="">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm"
                                    onClick={e => dataStore.addDataset(e)}>
                                    Add Dataset
                                </button>
                                {/* <div>
                                    Import Dataset <input type="file" />
                                </div> */}
                            </div>
                        </form>
                    </div>
                ) : null}
                {dataStore.datasets.length ? (
                    <div className="editdataset">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="table-primary">
                                    <th>{isEditSettings ? "Edit" : null}&nbsp; Datasets</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataStore.datasets.map((item, index) => {
                                    return [
                                        <tr key={index} className="currentdataset">
                                            <td>
                                                <a
                                                    onClick={() =>
                                                        dataStore.setCurrentDatasetIndex(
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
                {dataStore.datasets.length && isEditSettings ? (
                    <div>
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => dataStore.deleteDataset()}>
                            Delete Dataset
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
}

export default InputButtons;
