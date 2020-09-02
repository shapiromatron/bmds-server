import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class Delete extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={e => dataStore.deleteDataset()}>
                Delete Dataset
            </button>
        );
    }
}
Delete.propTypes = {
    dataStore: PropTypes.object,
    deleteDataset: PropTypes.func,
};
export default Delete;
