import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class LabelInput extends Component {
    constructor(props) {
        super(props);
        this._id = randomString();
    }
    render() {
        const {label} = this.props;
        return <label htmlFor={this._id}>{label}</label>;
    }
}

LabelInput.propTypes = {
    label: PropTypes.string.isRequired,
};

export default LabelInput;
