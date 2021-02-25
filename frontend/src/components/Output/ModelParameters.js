import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";
import {isParameterBounded} from "../../common";

@observer
class ModelParameters extends Component {
    render() {
        const {store} = this.props,
            parameters = store.modalModel.results.parameters;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="3">Model Parameters</th>
                    </tr>
                    <tr>
                        <th>Variable</th>
                        <th>Parameter</th>
                        <th>Bounded</th>
                    </tr>
                </thead>
                <tbody>
                    {parameters.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(parameters.values[i])}</td>
                                <td>{isParameterBounded(parameters.bounded[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ModelParameters.propTypes = {
    store: PropTypes.object,
};
export default ModelParameters;
