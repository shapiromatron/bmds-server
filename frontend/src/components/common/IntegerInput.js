import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class IntegerInput extends Component {
    constructor(props) {
        super(props);
        this._id = randomString();
    }
    render() {
        const {onChange, label, value} = this.props;
        return (
            <div className="form-group">
                {label ? <label htmlFor={this._id}>{label}</label> : null}
                <input
                    id={this._id}
                    className="form-control"
                    type="number"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
            </div>
        );
    }
}

IntegerInput.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
};

export default IntegerInput;
