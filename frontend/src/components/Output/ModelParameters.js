import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class ModelParameters extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Model Parameters</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Parameter</th>
                    </tr>
                </thead>
                <tbody>
                    {outputStore.getParameters.map((value, i) => {
                        return (
                            <tr key={i}>
                                <td>{value.p_variable}</td>
                                <td>{value.parameter}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelParameters.propTypes = {
    outputStore: PropTypes.object,
    getParameters: PropTypes.func,
};
export default ModelParameters;
