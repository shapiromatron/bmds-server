import React, {Component} from "react";
import DecisionLogic from "./DecisionLogic";
import DecisionLogicReadOnly from "./DecisionLogicReadOnly";
import RuleList from "./RuleList";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("logicStore")
@observer
class Logic extends Component {
    render() {
        const {logicStore} = this.props;
        return (
            <div className="container-fluid mt-2 logic">
                {logicStore.getEditSettings ? <DecisionLogic /> : <DecisionLogicReadOnly />}
                <RuleList />
            </div>
        );
    }
}

Logic.propTypes = {
    logicStore: PropTypes.object,
};
export default Logic;
