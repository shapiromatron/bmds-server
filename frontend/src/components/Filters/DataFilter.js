import React, {Component} from "react";

class DataFilter extends Component {
    constructor(props) {
        super(props);
    }

    filterData(datasets) {
        var newoutput = [];
        let index = "";
        datasets.forEach(function(data) {
            let newdata = data.dataset;
            index = data.id;
            newdata.forEach(function(item) {
                var existing = newoutput.filter(function(v, i) {
                    return v.name == item.name;
                });
                if (existing.length) {
                    var existingIndex = newoutput.indexOf(existing[0]);

                    newoutput[existingIndex].doses = newoutput[existingIndex].doses.concat(
                        item.doses
                    );
                    newoutput[existingIndex].ns = newoutput[existingIndex].ns.concat(item.ns);
                    newoutput[existingIndex].means = newoutput[existingIndex].means.concat(
                        item.means
                    );
                    newoutput[existingIndex].stdevs = newoutput[existingIndex].stdevs.concat(
                        item.stdevs
                    );
                } else {
                    if (Number.isInteger(item.doses)) item.doses = [item.doses];
                    if (Number.isInteger(item.ns)) item.ns = [item.ns];
                    if (Number.isInteger(item.means)) item.means = [item.means];
                    if (Number.isInteger(item.stdevs)) item.stdevs = [item.stdevs];
                    newoutput.push(item);
                }
            });
        });
        for (let i = 0; i < newoutput.length; i++) {
            newoutput[i].id = index;
        }
        return newoutput;
    }
    render() {
        return <div></div>;
    }
}

export default DataFilter;
