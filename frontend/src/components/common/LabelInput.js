import React, {Component} from "react";
import PropTypes from "prop-types";

class LabelInput extends Component {
    render() {
        const {label, htmlFor} = this.props;
        return <label htmlFor={htmlFor}>{label}</label>;
    }
}

LabelInput.propTypes = {
    label: PropTypes.string.isRequired,
    htmlFor: PropTypes.string.isRequired,
};

export default LabelInput;
