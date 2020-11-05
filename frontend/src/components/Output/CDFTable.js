import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";

@observer
class CDFTable extends Component {
    render() {
        const {store} = this.props,
            data = toJS(store.selectedModel.results.fit.bmd_dist);

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
                    {_.range(data[0].length).map(i => {
                        return (
                            <tr key={i}>
                                <td>{data[1][i]}</td>
                                <td>{data[0][i]}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
CDFTable.propTypes = {
    store: PropTypes.object,
};

export default CDFTable;
