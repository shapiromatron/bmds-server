import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class SelectModelType extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div>
                {dataStore.getEditSettings ? (
                    <div>
                        <form className="model-type">
                            <div className="form-group">
                                <label htmlFor="selectmodel">Select Model Type</label>
                                <select
                                    className="form-control"
                                    id="selectmodel"
                                    onChange={e => dataStore.setModelType(e.target.value)}>
                                    {dataStore.getFilteredModelTypes.map((item, i) => {
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
            </div>
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
