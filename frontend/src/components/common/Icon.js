import PropTypes from "prop-types";
import React, {Component} from "react";

class Icon extends Component {
    render() {
        const {name, classes} = this.props;
        return <span className={`bi bi-${name} ${classes}`} aria-hidden="true"></span>;
    }
}
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string,
};
Icon.defaultProps = {
    classes: "",
};

export default Icon;
