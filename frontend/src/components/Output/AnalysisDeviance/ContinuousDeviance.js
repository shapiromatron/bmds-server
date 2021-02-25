import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {continuousDevianceHeader} from "../../../constants/outputConstants";
import {ff} from "../../../common";
@observer
class ContinuousDeviance extends Component {
    render() {
        const {store} = this.props,
            deviances = store.continuousDeviance;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Analysis of Deviance</th>
                    </tr>
                    <tr>
                        {continuousDevianceHeader.map((header, i) => {
                            return <th key={i}>{header}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>
                    {deviances.map((deviance, idx) => {
                        var [deviance_name, ll, num_param, aic] = deviance;
                        return (
                            <tr key={idx}>
                                <td>{deviance_name}</td>
                                <td>{ff(ll)}</td>
                                <td>{num_param}</td>
                                <td>{ff(aic)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
ContinuousDeviance.propTypes = {
    store: PropTypes.object,
};
export default ContinuousDeviance;
