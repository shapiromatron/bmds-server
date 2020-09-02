import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class ReportOptions extends Component {
    renderOutputs() {
        const {mainStore} = this.props;
        if (!mainStore.executionOutputs) {
            return null;
        }
        return <pre>{JSON.stringify(mainStore.executionOutputs, undefined, 2)}</pre>;
    }
    render() {
        return (
            <div>
                <h2>Report Options page</h2>
                {this.renderOutputs()}
            </div>
        );
    }
}

ReportOptions.propTypes = {
    mainStore: PropTypes.object.isRequired,
    executionOutputs: PropTypes.object.isRequired,
};
export default ReportOptions;
