import React, {Component} from "react";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class ReportOptions extends Component {
    renderOutputs() {
        const {executionOutputs} = this.props.store;
        if (!executionOutputs) {
            return null;
        }
        return <pre>{JSON.stringify(executionOutputs, undefined, 2)}</pre>;
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

export default ReportOptions;
