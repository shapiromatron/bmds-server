import {Dtype} from "./dataConstants";

export const getPValue = function(dataType, results) {
        if (dataType === Dtype.DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return results.tests.p_values[3];
        }
    },
    priorClass = {
        frequentist_unrestricted: 0,
        frequentist_restricted: 1,
        bayesian: 2,
        custom: 3,
    },
    modelClasses = {
        frequentist: 0,
        bayesian: 1,
    };
