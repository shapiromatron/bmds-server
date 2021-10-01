import React, {Component} from "react";
import PropTypes from "prop-types";

class FloatInput extends Component {
    render() {
        const {value, onChange, disabled} = this.props;
        return (
            <input
                id={this._id}
                disabled={disabled}
                className="form-control"
                type="number"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        );
    }
}

FloatInput.propTypes = {
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default FloatInput;
