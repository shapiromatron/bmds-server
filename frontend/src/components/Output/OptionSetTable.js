import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import PropTypes from "prop-types";

const data = [
    ["BMR Type", "Std. Dev."],
    ["BMR Value", 1],
    ["Tail Probability", 0.01],
    ["Confidence Level", 0.95],
    ["Distribution + Variance", "Normal + Non-constant"],
    ["Dataset Direction", "Automatic"],
    ["Maximum Polynomial Degree", 3],
];

@inject("outputStore")
@observer
class OptionSetTable extends Component {
    render() {
        return (
            <table className="table table-sm table-bordered col-r-2">
                <tbody>
                    {data.map((d, i) => {
                        return (
                            <tr key={i}>
                                <th>{d[0]}</th>
                                <td>{d[1]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
OptionSetTable.propTypes = {
    outputStore: PropTypes.object,
};

export default OptionSetTable;
