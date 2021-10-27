import React, {Component} from "react";
import PropTypes from "prop-types";

class HelpText extends Component {
    render() {
        const {content} = this.props;
        return <div className="m-2">{content}</div>;
    }
}
HelpText.propTypes = {
    content: PropTypes.string.isRequired,
};

export default HelpText;
