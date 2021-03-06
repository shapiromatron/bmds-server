import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class DichotomousDeviance extends Component {
    render() {
        const {store} = this.props,
            deviances = store.modalModel.results.deviance;

        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Analysis of Deviance</th>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <th>LL</th>
                        <th>Num Params</th>
                        <th>Deviance</th>
                        <th>Test DF</th>
                        <th>P Value</th>
                    </tr>
                </thead>
                <tbody>
                    {deviances.names.map((name, i) => {
                        return (
                            <tr key={i}>
                                <td>{name}</td>
                                <td>{ff(deviances.ll[i])}</td>
                                <td>{deviances.params[i]}</td>
                                <td>{ff(deviances.deviance[i])}</td>
                                <td>{ff(deviances.df[i])}</td>
                                <td>{ff(deviances.p_value[i])}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
DichotomousDeviance.propTypes = {
    store: PropTypes.object,
};
export default DichotomousDeviance;
