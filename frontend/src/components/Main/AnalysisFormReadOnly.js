import React, {Component} from "react";
import {inject, observer} from "mobx-react";

@inject("mainStore")
@observer
class AnalysisFormReadOnly extends Component {
    render() {
        const {mainStore} = this.props,
            dataset_type = mainStore.modelTypes.find(
                item => item.value == mainStore.analysisForm.dataset_type
            );
        return (
            <div>
                <table className="table table-bordered table-primary table-sm analysis-readonly">
                    <tbody>
                        <tr>
                            <th>Analysis Name:</th>
                            <td>{mainStore.analysisForm.analysis_name}</td>
                        </tr>
                        <tr>
                            <th>Analysis Description:</th>
                            <td>{mainStore.analysisForm.analysis_description}</td>
                        </tr>
                        <tr>
                            <th>Model Type:</th>
                            <td>{dataset_type.name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default AnalysisFormReadOnly;
