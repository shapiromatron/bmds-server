import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class SelectModelType extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="model-type mb-2">
                <label htmlFor="selectModel">New dataset</label>
                <div className="input-group">
                    <select
                        className="form-control mr-1 p-0"
                        id="selectModel"
                        onChange={e => dataStore.setModelType(e.target.value)}>
                        {dataStore.getFilteredDatasetTypes.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </select>
                    <div className="input-group-append">
                        <button
                            type="button"
                            className="btn btn-primary btn-sm float-right"
                            disabled={dataStore.checkDatasetsLength}
                            onClick={() => dataStore.addDataset()}>
                            <i className="fa fa-fw fa-plus" />
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
SelectModelType.propTypes = {
    dataStore: PropTypes.object,
};
export default SelectModelType;
