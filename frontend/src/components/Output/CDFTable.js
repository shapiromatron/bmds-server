import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class CDFTable extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">CDF</th>
                    </tr>
                    <tr>
                        <th>Percentile</th>
                        <th>BMD</th>
                    </tr>
                </thead>
                <tbody>
                    {outputStore.getCDFValues.map((value, i) => {
                        return (
                            <tr key={i}>
                                <td>{value.pValue}</td>
                                <td>{value.cdf}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CDFTable.propTypes = {
    cdfValues: PropTypes.array,
    outputStore: PropTypes.object,
};

export default CDFTable;
