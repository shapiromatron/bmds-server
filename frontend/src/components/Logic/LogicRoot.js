import _ from "lodash";
import React, {Component} from "react";
import PropTypes from "prop-types";
import {inject, observer} from "mobx-react";

import DecisionLogic from "./DecisionLogic";
import RuleTable from "./RuleTable";

@inject("logicStore")
@observer
class Logic extends Component {
    render() {
        const {logic} = this.props.logicStore;

        if (!_.isObject(logic)) {
            return (
                <div className="container-fluid">
                    <p>No recommendation logic available.</p>
                </div>
            );
        }

        return (
            <div className="container-fluid">
                <DecisionLogic />
                <RuleTable />
            </div>
        );
    }
}

Logic.propTypes = {
    logicStore: PropTypes.object,
};

export default Logic;
