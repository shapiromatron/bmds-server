import _ from "lodash";
import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import * as dc from "../../constants/dataConstants";

@observer
class GoodnessFit extends Component {
    render() {
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Goodness of Fit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="9">TODO....</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
GoodnessFit.propTypes = {
    store: PropTypes.object,
};
export default GoodnessFit;
