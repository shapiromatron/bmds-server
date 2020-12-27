import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class AnalysisFormReadOnly extends Component {
    render() {
        const {mainStore} = this.props;
        return (
            <div className="mt-2">
                <table className="table table-bordered table-primary table-sm analysis-readonly">
                    <tbody>
                        <tr>
                            <th>Analysis Name:</th>
                            <td>{mainStore.analysis_name}</td>
                        </tr>
                        <tr>
                            <th>Analysis Description:</th>
                            <td>{mainStore.analysis_description}</td>
                        </tr>
                        <tr>
                            <th>Model Type:</th>
                            <td>{mainStore.getModelTypeName.name}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
AnalysisFormReadOnly.propTypes = {
    mainStore: PropTypes.object,
};
export default AnalysisFormReadOnly;
