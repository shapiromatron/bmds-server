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
            <table id="info-table" className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">Info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Dataset</td>
                        <td>{dataset.metadata.name}</td>
                    </tr>
                    <tr>
                        <td>Model</td>
                        <td>{model.name}</td>
                    </tr>
                    <tr>
                        <td>Equation</td>
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
