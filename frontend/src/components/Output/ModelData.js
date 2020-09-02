import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class ModelData extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Model Data</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(outputStore.getModelData).map((dev, i) => {
                        return (
                            <tr key={i}>
                                <td>{outputStore.getModelData[dev].label}</td>
                                <td>{outputStore.getModelData[dev].value}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelData.propTypes = {
    outputStore: PropTypes.object,
    getModelData: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.number,
};
export default ModelData;
