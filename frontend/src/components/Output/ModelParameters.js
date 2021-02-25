import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {ff} from "../../common";
@observer
class ModelParameters extends Component {
    render() {
        const {store} = this.props;
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
                    {store.modelParameters.map((params, idx) => {
                        var [variable, param, bounded] = params;
                        return (
                            <tr key={idx}>
                                <td>{variable}</td>
                                <td>{ff(param)}</td>
                                <td>
                                    {bounded.toString() === "true" ? (
                                        <i className="fa fa-check fa-lg "></i>
                                    ) : (
                                        <i className="fa fa-times fa-lg "></i>
                                    )}
                                </td>
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
