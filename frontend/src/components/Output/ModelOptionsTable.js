import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class ModelOptionsTable extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Model Options</th>
                    </tr>
                </thead>
                <tbody>
                    {outputStore.getModelOptions.map((dev, i) => {
                        return [
                            <tr key={i}>
                                <td>{dev.label}</td>
                                <td>{dev.value}</td>
                            </tr>,
                        ];
                    })}
                </tbody>
            </table>
        );
    }
}
ModelOptionsTable.propTypes = {
    outputStore: PropTypes.object,
    getModelOptions: PropTypes.func,
};
export default ModelOptionsTable;
