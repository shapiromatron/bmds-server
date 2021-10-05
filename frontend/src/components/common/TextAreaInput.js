import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class TextAreaInput extends Component {
    constructor(props) {
        super(props);
        this._id = randomString();
    }
    render() {
        const {onChange, rows, value} = this.props;
        return (
            <textarea
                id={this._id}
                rows={rows}
                className="form-control"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        );
    }
}

TextAreaInput.propTypes = {
    rows: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};
TextAreaInput.defaultProps = {
    rows: 3,
};

export default TextAreaInput;
