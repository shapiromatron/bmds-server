import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import CSGoodnessFit from "./CSGoodnessFit";
import DGoodnessFit from "./DGoodnessFit";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class GoodnessFit extends Component {
    render() {
        const {outputStore} = this.props;
        let model_type = outputStore.getModelType;
        return (
            <table className="table table-bordered table-sm">
                <thead className="table-primary">
                    <tr>
                        <th colSpan="9">Goodness of Fit</th>
                    </tr>
                    <tr>
                        {outputStore.getGoodnessFitHeaders.map((header, i) => {
                            return <th key={i}>{header}</th>;
                        })}
                    </tr>
                </thead>
                {model_type == "CS" ? (
                    <CSGoodnessFit goodnessFit={outputStore.getGoodnessFit} />
                ) : null}
                {model_type == "DM" ? (
                    <DGoodnessFit goodnessFit={outputStore.getGoodnessFit} />
                ) : null}
            </table>
        );
    }
}
GoodnessFit.propTypes = {
    outputStore: PropTypes.object,
    getModelType: PropTypes.func,
    getGoodnessFitHeaders: PropTypes.func,
    getGoodnessFit: PropTypes.func,
};
export default GoodnessFit;
