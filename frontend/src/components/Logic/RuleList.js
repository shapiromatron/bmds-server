import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";
import Rule from "./Rule";
import {headers, disabled_properties, long_name} from "../../constants/logicConstants";

@inject("logicStore")
@observer
class RuleList extends Component {
    render() {
        const {logicStore} = this.props;
        let rules = toJS(logicStore.logic.rules);

        return (
            <div className=" row">
                <div className="col col-sm-8 table-responsive ">
                    <table className="table table-bordered table-sm rule-list">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="7" className="text-center">
                                    Model Recommendation/Bin Placement Logic
                                </th>
                            </tr>
                            <tr>
                                {headers.map((item, i) => {
                                    return (
                                        <th key={i} className="text-center">
                                            {item}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(rules).map((rule, i) => {
                                return (
                                    <Rule
                                        key={i}
                                        rule={rules[rule]}
                                        rule_name={rule}
                                        long_name={long_name[rule].name}
                                        notes={long_name[rule].notes}
                                        changeLogicValues={logicStore.changeLogicValues}
                                        disableList={disabled_properties}
                                    />
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

RuleList.propTypes = {
    logicStore: PropTypes.object,
    getModelRecommendationHeaders: PropTypes.func,
    getModelRecommendationList: PropTypes.func,
    toggleTest: PropTypes.func,
};

export default RuleList;
