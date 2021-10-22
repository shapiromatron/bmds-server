import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class Button extends Component {
    constructor(props) {
        super(props);
        this._id = props.id || randomString();
    }
    render() {
        const {
            id,
            text,
            className,
            onClick,
            disabled,
            faClass,
            datatoggle,
            haspopup,
            title,
            hidden,
        } = this.props;
        return (
            <button
                id={id ? id : this._id}
                type="button"
                className={className}
                disabled={disabled}
                data-toggle={datatoggle ? datatoggle : null}
                aria-haspopup={haspopup ? haspopup : null}
                title={title ? title : null}
                aria-hidden={hidden ? hidden : null}
                onClick={onClick}>
                {faClass ? <i className={faClass} /> : null}
                {text}
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
    datatoggle: PropTypes.string,
    haspopup: PropTypes.bool,
    hidden: PropTypes.bool,
};
Button.defaultProps = {
    disabled: false,
};

export default Button;
