import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";
import LabelInput from "./LabelInput";

@observer
class FloatInput extends Component {
    constructor(props) {
        super(props);
        this._id = props.id || randomString();
    }
    render() {
        const {label, className, value, onChange, disabled} = this.props;
        return (
            <>
                {label ? <LabelInput label={label} htmlFor={this._id} /> : null}
                <input
                    id={this._id}
                    disabled={disabled}
                    className={className}
                    type="number"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </>
        );
    }
}

FloatInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};
FloatInput.defaultProps = {
    className: "form-control",
    disabled: false,
};

export default FloatInput;
