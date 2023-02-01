import {
    ff,
    fourDecimalFormatter,
    fractionalFormatter,
    parameterFormatter,
} from "../../src/utils/formatters";
import assert from "../helpers";

const check = function(func, input, output) {
    assert.equal(func(input), output);
};

describe("common", function() {
    describe("ff", function() {
        it("formats as expected", function() {
            // special cases
            check(ff, -9999, "-");
            check(ff, Infinity, "-");
            check(ff, 0, "0");

            // normal range
            check(ff, 1, "1");
            check(ff, -1, "-1");
            check(ff, 1.234, "1.234");
            check(ff, 10.234, "10.234");
            check(ff, 100.234, "100.234");
            check(ff, 1001.234, "1,001.234");

            // big numbers
            check(ff, 1000, "1,000");
            check(ff, 10000, "10,000");
            check(ff, 99999, "99,999");
            check(ff, 100000, "1.00e+5");
            check(ff, 123456, "1.23e+5");

            // big negative numbers
            check(ff, -1000, "-1,000");
            check(ff, -10000, "-10,000");
            check(ff, -99999, "-99,999");
            check(ff, -100000, "-1.00e+5");
            check(ff, -123456, "-1.23e+5");

            // small numbers
            check(ff, 0.1, "0.1");
            check(ff, 0.01, "0.01");
            check(ff, 0.0011, "0.001");
            check(ff, 0.001, "1.00e-3");
            check(ff, 0.0001, "1.00e-4");
            check(ff, 0.0000123, "1.23e-5");
        });
    });

    describe("fourDecimalFormatter", function() {
        it("formats as expected", function() {
            // special cases
            check(fourDecimalFormatter, -9999, "-");
            check(fourDecimalFormatter, Infinity, "-");
            check(fourDecimalFormatter, 0, "0");

            // normal range
            check(fourDecimalFormatter, 99.9999, "99.9999");
            check(fourDecimalFormatter, 10.23456, "10.2346");
            check(fourDecimalFormatter, 1.23456, "1.2346");
            check(fourDecimalFormatter, 0.23456, "0.2346");
            check(fourDecimalFormatter, -0.23456, "-0.2346");
            check(fourDecimalFormatter, -10.23456, "-10.2346");

            // big numbers (boundary)
            check(fourDecimalFormatter, 99.99996, "100.0000");
            check(fourDecimalFormatter, 100, "100");

            // small numbers
            check(fourDecimalFormatter, 0.01, "0.0100");
            check(fourDecimalFormatter, 0.001, "0.0010");
            check(fourDecimalFormatter, 0.0001, "0.0001");
            check(fourDecimalFormatter, 0.000099999, "<0.0001");
            check(fourDecimalFormatter, 0.00001, "<0.0001");
            check(fourDecimalFormatter, 1e-8, "<0.0001");
        });
    });

    describe("parameterFormatter", function() {
        it("formats as expected", function() {
            // special cases
            check(parameterFormatter, -9999, "-");
            check(parameterFormatter, Infinity, "-");
            check(parameterFormatter, 0, "0");

            // normal range
            check(parameterFormatter, 99.9999, "100.0");
            check(parameterFormatter, 10.23456, "10.23");
            check(parameterFormatter, 1.23456, "1.235");
            check(parameterFormatter, 0.23456, "0.2346");
            check(parameterFormatter, -0.23456, "-0.2346");
            check(parameterFormatter, -10.23456, "-10.23");

            // big numbers (boundary)
            check(parameterFormatter, 99.99996, "100.0");
            check(parameterFormatter, 100, "100.0");

            // small numbers
            check(parameterFormatter, 0.01, "0.01000");
            check(parameterFormatter, 0.001, "1.000e-3");
            check(parameterFormatter, 0.0001, "1.000e-4");
            check(parameterFormatter, 0.000099999, "1.000e-4");
            check(parameterFormatter, 0.00001, "1.000e-5");
            check(parameterFormatter, 1e-8, "1.000e-8");
        });
    });

    describe("fractionalFormatter", function() {
        it("formats as expected", function() {
            // special cases
            assert.equal(fractionalFormatter(-9999), "-");
            assert.equal(fractionalFormatter(Infinity), "-");
            assert.equal(fractionalFormatter(0), "0");

            // normal range
            assert.equal(fractionalFormatter(0.23456), "0.235");
            assert.equal(fractionalFormatter(0.23456), "0.235");
            assert.equal(fractionalFormatter(10.23456), "10.2");

            // // big numbers
            assert.equal(fractionalFormatter(99.9999), "100");
            assert.equal(fractionalFormatter(10.23456), "10.2");
            assert.equal(fractionalFormatter(1.23456), "1.23");
            assert.equal(fractionalFormatter(99.99996), "100");
            assert.equal(fractionalFormatter(100), "100");

            // small numbers
            assert.equal(fractionalFormatter(0.01), "0.0100");
            assert.equal(fractionalFormatter(0.001), "0.00100");
            assert.equal(fractionalFormatter(0.0001), "0.000100");
            assert.equal(fractionalFormatter(0.000099999), "< 0.0001");
            assert.equal(fractionalFormatter(0.00001), "< 0.0001");
            assert.equal(fractionalFormatter(1e-8), "< 0.0001");
        });
    });
});
