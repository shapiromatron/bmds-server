import _ from "lodash";
import PropTypes from "prop-types";
import React, {Component} from "react";

class Popover extends Component {
    constructor(props) {
        super(props);
        this.domNode = React.createRef();
    }
    componentDidMount() {
        window.$(this.domNode.current).popover({placement: "auto", trigger: "hover"});
    }
    componentWillUnmount() {
        window.$(this.domNode.current).popover("dispose");
    }
    render() {
        const {children, content, title, element} = this.props;
        let props = _.fromPairs([
            ["ref", this.domNode],
            ["title", title],
            ["aria-hidden", "true"],
            ["data-html", "true"],
            ["data-toggle", "popover"],
            ["data-content", content],
        ]);
        return React.createElement(element, props, children);
    }
}
Popover.propTypes = {
    element: PropTypes.string,
    content: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};
Popover.defaultProps = {
    element: "div",
};

export default Popover;
