import React, {Component} from "react";

class OptionsFilter extends Component {
    constructor(props) {
        super(props);
    }

    filterOptions(options) {
        for (let i = 0; i < options.length; i++) {
            let data = options[i];
            let keys = Object.keys(data);
            keys.forEach(function(item) {
                if (
                    item === "bmr_value" ||
                    item === "tail_probability" ||
                    item === "confidence_level"
                ) {
                    let a = parseInt(data[item]);
                    data[item] = a;
                }
            });
        }

        return options;
    }
    render() {
        return <div></div>;
    }
}

export default OptionsFilter;
