import {observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import {randomString} from "@/common";

import LabelInput from "./LabelInput";

@observer
class TextAreaInput extends Component {
    constructor(props) {
        super(props);
        this._id = props.id || randomString();
    }
    render() {
        const {label, onChange, rows, value} = this.props;
        return (
            <>
                {label ? <LabelInput label={label} htmlFor={this._id} /> : null}
                <textarea
                    id={this._id}
                    rows={rows}
                    className="form-control"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </>
        );
    }
}

TextAreaInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    rows: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};
TextAreaInput.defaultProps = {
    rows: 3,
};

export default TextAreaInput;
