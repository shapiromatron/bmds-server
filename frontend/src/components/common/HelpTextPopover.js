import PropTypes from "prop-types";
import React, {Component} from "react";

import Popover from "./Popover";

class HelpTextPopover extends Component {
    render() {
        const {icon, title, content} = this.props;
        return (
            <Popover element={"span"} content={content} title={title}>
                <i className={`ml-1 fa fa-fw ${icon}`}></i>
            </Popover>
        );
    }
}
HelpTextPopover.propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string.isRequired,
};
HelpTextPopover.defaultProps = {
    icon: "fa-question-circle",
    title: "Help-text",
};

export default HelpTextPopover;
