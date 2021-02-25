import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {ff} from "../../../common";

@observer
class DichotomousDeviance extends Component {
    render() {
        const {store} = this.props,
            deviances = store.dichotomousdeviance;
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
                    {deviances.map((item, idx) => {
                        var [model_name, ll, param, deviance, test_df, pval] = item;
                        return (
                            <tr key={idx}>
                                <td>{model_name}</td>
                                <td>{ff(ll)}</td>
                                <td>{param}</td>
                                <td>{ff(deviance)}</td>
                                <td>{ff(test_df)}</td>
                                <td>{ff(pval)}</td>
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
