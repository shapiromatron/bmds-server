import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class ModelParameters extends Component {
    render() {
        const {store} = this.props;
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
                    {_.map(store.selectedParams, (value, key) => {
                        return (
                            <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
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
