import PropTypes from "prop-types";
import React, {Component} from "react";

class TwoColumnTable extends Component {
    render() {
        const {data, label} = this.props;
        return (
            <table className="table table-sm table-bordered">
                <thead>
                    <tr className="bg-custom">
                        <th colSpan="2">{label}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={i}>
                            <td>{item[0]}</td>
                            <td>{item[1]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
TwoColumnTable.propTypes = {
    data: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
};

export default TwoColumnTable;
