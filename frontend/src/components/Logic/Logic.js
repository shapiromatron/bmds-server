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
    }
    render() {
        return (
            <div className="container-fluid mt-2 logic">
                <DecisionLogic />
                <RuleList />
            </div>
        );
    }
}

Logic.propTypes = {
    logicStore: PropTypes.object,
    setDefaultState: PropTypes.func,
};
export default Logic;
