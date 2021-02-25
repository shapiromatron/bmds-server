import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {ff} from "../../common";
import {testofInterestHeaders} from "../../constants/outputConstants";

@observer
class CSTestofInterest extends Component {
    render() {
        const {store} = this.props,
            testInterest = store.testInterest;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="4">Test of Interest</th>
                    </tr>
                    <tr>
                        {testofInterestHeaders.map((header, i) => {
                            return <th key={i}>{header}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {testInterest.map((gof, idx) => {
                        var [test, ll_ratio, df, p_value] = gof;
                        return (
                            <tr key={idx}>
                                <td>{test}</td>
                                <td>{ff(ll_ratio)}</td>
                                <td>{ff(df)}</td>
                                <td>{ff(p_value)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CSTestofInterest.propTypes = {
    store: PropTypes.object,
};
export default CSTestofInterest;
