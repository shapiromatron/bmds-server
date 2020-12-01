import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class SelectModelType extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <form className="model-type">
                <div className="form-group">
                    <label htmlFor="selectmodel">Select Model Type</label>
                    <select
                        className="form-control"
                        id="selectmodel"
                        onChange={e => dataStore.setModelType(e.target.value)}>
                        {dataStore.getFilteredModelTypes.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                    <button
                        type="button"
                        className="adddataset btn btn-primary btn-sm mr-2"
                        disabled={dataStore.checkDatasetsLength}
                        onClick={() => dataStore.addDataset()}>
                        Add Dataset
                    </button>
                    <label htmlFor="file" className="fileContainer btn btn-primary">
                        Import Datasets
                        <input
                            type="file"
                            id="file"
                            onChange={e => dataStore.importDatasets(e.target.files[0])}
                        />
                    </label>
                </div>
            </form>
        );
    }
}
SelectModelType.propTypes = {
    dataStore: PropTypes.object,
    setModelType: PropTypes.func,
    getEditSettings: PropTypes.func,
    getFilteredModelTypes: PropTypes.func,
    addDataset: PropTypes.func,
};
export default SelectModelType;
