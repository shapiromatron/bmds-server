import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("logicStore")
@observer
class ModelRecommendation extends Component {
    render() {
        const {logicStore} = this.props;
        return (
            <div className=" row">
                <div className="col col-sm-8">
                    <table className="table table-bordered table-sm model-recommend">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="7" className="text-center">
                                    Model Recommendation/Bin Placement Logic
                                </th>
                            </tr>
                            <tr>
                                {logicStore.getModelRecommendationHeaders.map((item, i) => {
                                    return (
                                        <th key={i} className="text-center">
                                            {item}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {logicStore.modelRecommendationList.map((item, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{item.model}</td>
                                        {item.values.map((val, i) => {
                                            return (
                                                <td key={i}>
                                                    {val.input === "select" ? (
                                                        <select
                                                            className="form-control"
                                                            name={val.name}
                                                            disabled={val.disabled}
                                                            onChange={e => logicStore.toggleTest(e)}
                                                            value={val.value}>
                                                            {val.options.map((item, i) => {
                                                                return [
                                                                    <option value={item} key={i}>
                                                                        {item}
                                                                    </option>,
                                                                ];
                                                            })}
                                                        </select>
                                                    ) : null}
                                                    {val.input === "text" ? (
                                                        <input
                                                            className="form-control text-center"
                                                            name={val.name}
                                                            value={val.value}
                                                            onChange={e => logicStore.toggleTest(e)}
                                                            disabled={val.disabled}
                                                        />
                                                    ) : null}
                                                    {val.input === "" ? <p>{val.value}</p> : null}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

ModelRecommendation.propTypes = {
    logicStore: PropTypes.object,
    getModelRecommendationHeaders: PropTypes.func,
    getModelRecommendationList: PropTypes.func,
    toggleTest: PropTypes.func,
};

export default ModelRecommendation;
