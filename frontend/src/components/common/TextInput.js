import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class TextInput extends Component {
    constructor(props) {
        super(props);
        this._id = randomString();
    }
    render() {
        const {onChange, label, value} = this.props;
        return (
            <>
                {label ? <label htmlFor={this._id}>{label}</label> : null}
                <input
                    id={this._id}
                    className="form-control"
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </>
        );
    }
}

TextInput.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default TextInput;
