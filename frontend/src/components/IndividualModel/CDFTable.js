import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {ff} from "../../common";

@observer
class CDFTable extends Component {
    render() {
        const {bmd_dist} = this.props;
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
                    {bmd_dist[0].length == 0 ? (
                        <tr>
                            <td colSpan={2}>
                                <i>No data available.</i>
                            </td>
                        </tr>
                    ) : (
                        _.range(bmd_dist[0].length).map(i => {
                            return (
                                <tr key={i}>
                                    <td>{ff(bmd_dist[1][i])}</td>
                                    <td>{ff(bmd_dist[0][i])}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        );
    }
}
CDFTable.propTypes = {
    bmd_dist: PropTypes.array,
};

export default CDFTable;
