import React, {Component} from "react";
import _ from "lodash";

class ModelFilter extends Component {
    constructor(props) {
        super(props);
    }

    filterModel(models) {
        let FrequentistRestricted = [];
        let FrequentistUnRestricted = [];
        let Bayesian = [];
        let BayesianModelAverage = [];

        for (let i = 0; i < models.length; i++) {
            var a = models[i].split("-");
            if (a[0] == "frequentist_restricted") {
                FrequentistRestricted.push(a[1]);
            } else if (a[0] == "frequentist_unrestricted") {
                FrequentistUnRestricted.push(a[1]);
            } else if (a[0] == "bayesian") {
                Bayesian.push(a[1]);
            } else {
                BayesianModelAverage.push(a[1]);
            }
        }

        let array1 = {frequentist_restricted: FrequentistRestricted};
        let array2 = {frequentist_unrestricted: FrequentistUnRestricted};
        let array3 = {bayesian: Bayesian};
        let array4 = {bayesian_model_average: BayesianModelAverage};

        let modelType = _.merge(array1, array2, array3, array4);

        var keys = Object.keys(modelType);
        keys.forEach(function(item) {
            if (modelType[item].length == 0) {
                delete modelType[item];
            }
        });

        return modelType;
    }
    render() {
        return <div></div>;
    }
}

export default ModelFilter;
