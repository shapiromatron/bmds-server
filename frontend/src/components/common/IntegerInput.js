import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";
import LabelInput from "./LabelInput";

@observer
class IntegerInput extends Component {
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
                    type="number"
                    step="1"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </>
        );
    }
}

IntegerInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
};

export default IntegerInput;
