import React, {Component} from "react";
import {observer} from "mobx-react";
import PropTypes from "prop-types";

import {randomString} from "../../common";

@observer
class SelectInput extends Component {
    constructor(props) {
        super(props);
        this._id = randomString();
    }
    render() {
        const {onChange, value, choices} = this.props;
        return (
            <select
                id={this._id}
                className="form-control p-0"
                onChange={e => onChange(e.target.value)}
                value={value}>
                {choices.map(choice => {
                    return (
                        <option key={choice.value} value={choice.value}>
                            {choice.text}
                        </option>
                    );
                })}
            </select>
        );
    }
}

SelectInput.propTypes = {
    choices: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            text: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any.isRequired,
};

export default SelectInput;
