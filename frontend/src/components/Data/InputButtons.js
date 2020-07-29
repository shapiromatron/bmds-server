import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import DatasetNames from "./DatasetNames";

@inject("dataStore")
@observer
class InputButtons extends Component {
    render() {
        const {dataStore} = this.props,
            onChange = e => {
                dataStore.setModelType(e.target.value);
            },
            onClick = (e, id) => {
                dataStore.setCurrentDatasetIndex(id);
            },
            isEditSettings = dataStore.getEditSettings(),
            datasets = toJS(dataStore.datasets),
            modelTypes = dataStore.getFilteredModelTypes();
        return (
            <div>
                {isEditSettings ? (
                    <div>
                        <form className="model-type">
                            <div className="form-group">
                                <label htmlFor="selectmodel">Select Model Type</label>
                                <select
                                    className="form-control"
                                    id="selectmodel"
                                    onChange={onChange}>
                                    {modelTypes.map((item, i) => {
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
                            </div>
                        </form>
                    </div>
                ) : null}
                {dataStore.datasets.length ? (
                    <DatasetNames onClick={onClick.bind(this)} datasets={datasets} />
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
