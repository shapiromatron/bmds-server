import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class InfoTable extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Info</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(outputStore.getInfoTable).map((dev, i) => {
                        return [
                            <tr key={i}>
                                <td>{outputStore.getInfoTable[dev].label}</td>
                                <td>{outputStore.getInfoTable[dev].value}</td>
                            </tr>,
                        ];
                    })}
                </tbody>
            </table>
        );
    }
}
InfoTable.propTypes = {
    outputStore: PropTypes.object,
    getInfoTable: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.number,
};
export default InfoTable;
