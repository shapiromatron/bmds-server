import {Dtype} from "./dataConstants";
import {BMDS_BLANK_VALUE} from "../common";

export const getPValue = function(dataType, results) {
    if (dataType === Dtype.DICHOTOMOUS) {
        return results.gof.p_value;
    } else {
        return BMDS_BLANK_VALUE;
    }
};
