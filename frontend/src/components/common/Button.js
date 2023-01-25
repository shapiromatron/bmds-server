import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

@observer
class Button extends Component {
    render() {
        const {props} = this;
        return (
            <button
                id={props.id || null}
                type="button"
                className={props.className}
                disabled={props.disabled}
                data-toggle={props.dataToggle || null}
                aria-haspopup={props.hasPopup || null}
                title={props.title || null}
                onClick={props.onClick}>
                {props.faClass ? <i className={props.faClass} /> : null}
                {props.text}
            </button>
        );
    }
}

Button.propTypes = {
    id: PropTypes.string,
    text: PropTypes.string,
    className: PropTypes.string.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    faClass: PropTypes.string,
    dataToggle: PropTypes.string,
    hasPopup: PropTypes.bool,
};
Button.defaultProps = {
    disabled: false,
};

export default Button;
