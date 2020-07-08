import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import DatasetList from "./DatasetList";
import {toJS} from "mobx";

@inject("dataStore")
@observer
class InputButtons extends Component {
    render() {
        const {dataStore} = this.props,
            onChange = e => {
                dataStore.model_type = e.target.value;
            },
            onClick = (e, id) => {
                dataStore.setCurrentDatasetIndex(id);
            },
            isEditSettings = dataStore.getEditSettings(),
            datasets = toJS(dataStore.datasets);
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
                            </div>
                        </form>
                    </div>
                ) : null}

                <DatasetList onClick={onClick.bind(this)} datasets={datasets} />
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
