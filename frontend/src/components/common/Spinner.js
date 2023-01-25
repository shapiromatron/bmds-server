import PropTypes from "prop-types";
import React from "react";

class Spinner extends React.Component {
    render() {
        return (
            <p>
                {this.props.text}&nbsp;
                <i className="fa fa-spinner fa-spin fa-fw" aria-hidden="true"></i>
            </p>
        );
    }
}
Spinner.propTypes = {
    text: PropTypes.string,
};

Spinner.defaultProps = {
    text: "Loading, please wait...",
};

export default Spinner;
