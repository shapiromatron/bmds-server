import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";
import {ff} from "../../common";

@observer
class GoodnessFit extends Component {
    render() {
        const {store} = this.props,
            goodnessFit = store.goodnessofFit;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Goodness of Fit</th>
                    </tr>
                    <tr>
                        <th>Dose</th>
                        <th>Est. Prob</th>
                        <th>Expected</th>
                        <th>Observed</th>
                        <th>Size</th>
                        <th>Scaled Res.</th>
                    </tr>
                </thead>
                <tbody>
                    {goodnessFit.map((gof, idx) => {
                        var [dose, estProb, expected, observed, size, residual] = gof;
                        return (
                            <tr key={idx}>
                                <td>{dose}</td>
                                <td>{ff(estProb)}</td>
                                <td>{ff(expected)}</td>
                                <td>{observed}</td>
                                <td>{size}</td>
                                <td>{ff(residual)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }
}
GoodnessFit.propTypes = {
    store: PropTypes.object,
};
export default GoodnessFit;
