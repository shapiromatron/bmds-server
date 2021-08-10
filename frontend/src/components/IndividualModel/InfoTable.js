import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class InfoTable extends Component {
    render() {
        const {outputStore} = this.props,
            model = outputStore.modalModel,
            dataset = outputStore.selectedDataset;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2" className="text-center">
                            Info
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Model name</td>
                        <td>{model.name}</td>
                    </tr>
                    <tr>
                        <td>Dataset name</td>
                        <td>{dataset.metadata.name}</td>
                    </tr>
                    <tr>
                        <td>Model form</td>
                        <td>{model.model_class.model_form_str}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
InfoTable.propTypes = {
    outputStore: PropTypes.object,
};
export default InfoTable;
