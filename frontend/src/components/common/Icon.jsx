import PropTypes from "prop-types";
import React, {Component} from "react";

class Icon extends Component {
    render() {
        const {name, classes, text} = this.props,
            extra = text ? " mr-1 " : " ",
            icon = <span className={`bi bi-${name}${extra}${classes}`} aria-hidden="true"></span>;
        if (text) {
            return (
                <>
                    {icon}
                    {text}
                </>
            );
        }
        return icon;
    }
}
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string,
    text: PropTypes.string,
};
Icon.defaultProps = {
    classes: "",
    text: "",
};

export default Icon;
