import React, {Component} from "react";
import PropTypes from "prop-types";

class FloatInput extends Component {
    render() {
        const {className, value, onChange, disabled} = this.props;
        return (
            <input
                id={this._id}
                disabled={disabled}
                className={className}
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        );
    }
}

FloatInput.propTypes = {
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
FloatInput.defaultProps = {
    className: "form-control",
};

export default FloatInput;
