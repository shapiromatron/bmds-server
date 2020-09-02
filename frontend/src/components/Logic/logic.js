import React, {Component} from "react";
import DecisionLogic from "./DecisionLogic";
import RuleList from "./RuleList";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import "./Logic.css";

@inject("logicStore")
@observer
class Logic extends Component {
    constructor(props) {
        super(props);
        this.props.logicStore.setDefaultState();
    }
    render() {
        return (
            <div className="container-fluid">
                <div className="logic">
                    <DecisionLogic />
                    <RuleList />
                </div>
            </div>
        );
    }
}

Logic.propTypes = {
    logicStore: PropTypes.object,
    setDefaultState: PropTypes.func,
};
export default Logic;
