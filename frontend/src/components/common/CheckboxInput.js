import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

@observer
class CheckboxInput extends Component {
    render() {
        const {id, onChange, checked, disabled} = this.props;
        return (
            <input
                id={id}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={e => onChange(e.target.checked)}
            />
        );
    }
}

CheckboxInput.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    checked: PropTypes.any.isRequired,
    disabled: PropTypes.bool,
};

export default CheckboxInput;
