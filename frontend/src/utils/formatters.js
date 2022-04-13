import _ from "lodash";

const BMDS_BLANK_VALUE = -9999;

export const ff = function(value) {
        // ff = float format
        if (value === 0) {
            return value.toString();
        } else if (value == BMDS_BLANK_VALUE || !_.isFinite(value)) {
            return "-";
        } else if (Math.abs(value) > 0.001 && Math.abs(value) < 1e5) {
            // local print "0" for anything smaller than this
            return value.toLocaleString();
        } else {
            // too many 0; use exponential notation
            return value.toExponential(2);
        }
    },
    fourDecimalFormatter = function(value) {
        // Expected values between 0 and 100; with happy case, returns 4 decimals
        if (value === 0) {
            return value.toString();
        } else if (value == BMDS_BLANK_VALUE || !_.isFinite(value)) {
            return "-";
        } else if (Math.abs(value) >= 100) {
            return ff(value);
        } else if (value > 0 && value < 0.0001) {
            return "<0.0001";
        } else {
            return value.toFixed(4);
        }
    };
