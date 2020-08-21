import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class BenchmarkDose extends Component {
    render() {
        const {outputStore} = this.props;
        return (
            <table className="table table-bordered table-sm">
                <thead>
                    <tr className="table-primary">
                        <th colSpan="2">Benchmark Dose</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(outputStore.getBenchmarkDose).map((dev, i) => {
                        return [
                            <tr key={i}>
                                <td>{outputStore.getBenchmarkDose[dev].label}</td>
                                <td>{outputStore.getBenchmarkDose[dev].value}</td>
                            </tr>,
                        ];
                    })}
                </tbody>
            </table>
        );
    }
}

BenchmarkDose.propTypes = {
    outputStore: PropTypes.object,
    getBenchmarkDose: PropTypes.func,
    label: PropTypes.string,
    value: PropTypes.number,
};

export default BenchmarkDose;
