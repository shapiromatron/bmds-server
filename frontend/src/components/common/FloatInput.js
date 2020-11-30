import React, {Component} from "react";
import PropTypes from "prop-types";

const reFloat = new window.RegExp(/^-?[\d]+\.?[\d]*[eE]?-?\d*$/);

class FloatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            strValue: props.value.toString(),
        };
    }
    render() {
        const {id, name, onChange, minimum, maximum} = this.props;
        return (
            <input
                type="text"
                name={name}
                value={this.state.strValue}
                id={id}
                className="form-control"
                onBlur={onChange}
                onChange={e => {
                    // edge case; handle if user enters "." which defaults to 0
                    let strValue = e.target.value;
                    if (strValue.slice(0, 1) === ".") {
                        strValue = "0" + strValue;
                    }
                    // check if float, and value is NaN, and min/max if those exists
                    const val = parseFloat(strValue);
                    if (
                        reFloat.test(strValue) === false ||
                        window.isNaN(val) ||
                        (minimum && val < minimum) ||
                        (maximum && val > maximum)
                    ) {
                        return;
                    }
                    this.setState({strValue});
                }}
            />
        );
    }
}

FloatInput.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    minimum: PropTypes.number,
    maximum: PropTypes.number,
};

export default FloatInput;
