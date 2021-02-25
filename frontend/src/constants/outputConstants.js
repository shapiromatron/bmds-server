import {Dtype} from "./dataConstants";
import {BMDS_BLANK_VALUE} from "../common";

const getPValue = function(dataType, results) {
        if (dataType === Dtype.DICHOTOMOUS) {
            return results.gof.p_value;
        } else {
            return BMDS_BLANK_VALUE;
        }
    },
    dichotomousDevianceHeader = ["Model", "LL", "Num Params", "Deviance", "Test DF", "P value"],
    continuousDevianceHeader = ["Name", "Loglikelihood", "Num Params", "AIC"],
    goodnessFitHeaders = ["Dose", "Est. Prob", "Expected", "Observed", "Size", "Scaled Res."],
    testofInterestHeaders = ["Test", "Likelihood Ratio", "DF", "P Value"],
    modelParametersHeaders = ["Variable", "Parameter", "Bounded"];

export {
    getPValue,
    dichotomousDevianceHeader,
    goodnessFitHeaders,
    continuousDevianceHeader,
    testofInterestHeaders,
    modelParametersHeaders,
};
