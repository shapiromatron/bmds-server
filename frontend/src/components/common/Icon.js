import PropTypes from "prop-types";
import React, {Component} from "react";

class Icon extends Component {
    render() {
        // TODO - change like the `faClass` property for button?
        // TODO - add a bi-fw, like fa-fw?
        const {name, classes} = this.props;
        return <span className={`bi bi-${name} ${classes}`} aria-hidden="true"></span>;
    }
}
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    classes: PropTypes.string,
};
Icon.defaultProps = {
    classes: "pr-1",
};

export default Icon;
