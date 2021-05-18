import {Dtype} from "./dataConstants";
import {BMDS_BLANK_VALUE} from "../common";

export const getPValue = function(dataType, results) {
        if (dataType === Dtype.DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return BMDS_BLANK_VALUE;
        }
    },
    priorClass = {
        frequentist_unrestricted: 0,
        frequentist_restricted: 1,
        bayesian: 2,
        custom: 3,
    };
