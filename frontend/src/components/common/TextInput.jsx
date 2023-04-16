import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {randomString} from "@/common";

import LabelInput from "./LabelInput";

class TextInput extends Component {
    constructor(props) {
        super(props);
        this._id = props.id || randomString();
    }
    render() {
        const {label, onChange, value} = this.props;
        return (
            <>
                {label ? <LabelInput label={label} htmlFor={this._id} /> : null}
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
    id: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default observer(TextInput);
