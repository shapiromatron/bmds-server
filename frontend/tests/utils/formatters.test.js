import {ff, fourDecimalFormatter} from "../../src/utils/formatters";
import assert from "../helpers";

describe("common", function() {
    describe("ff", function() {
        it("formats as expected", function() {
            // special cases
            assert.equal(ff(-9999), "-");
            assert.equal(ff(Infinity), "-");
            assert.equal(ff(0), "0");

            // normal range
            assert.equal(ff(1), "1");
            assert.equal(ff(-1), "-1");
            assert.equal(ff(1.234), "1.234");
            assert.equal(ff(10.234), "10.234");
            assert.equal(ff(100.234), "100.234");
            assert.equal(ff(1001.234), "1,001.234");

            // big numbers
            assert.equal(ff(1000), "1,000");
            assert.equal(ff(10000), "10,000");
            assert.equal(ff(99999), "99,999");
            assert.equal(ff(100000), "1.00e+5");
            assert.equal(ff(123456), "1.23e+5");

            // big negative numbers
            assert.equal(ff(-1000), "-1,000");
            assert.equal(ff(-10000), "-10,000");
            assert.equal(ff(-99999), "-99,999");
            assert.equal(ff(-100000), "-1.00e+5");
            assert.equal(ff(-123456), "-1.23e+5");

            // small numbers
            assert.equal(ff(0.1), "0.1");
            assert.equal(ff(0.01), "0.01");
            assert.equal(ff(0.0011), "0.001");
            assert.equal(ff(0.001), "1.00e-3");
            assert.equal(ff(0.0001), "1.00e-4");
            assert.equal(ff(0.0000123), "1.23e-5");
        });
    });

    describe("fourDecimalFormatter", function() {
        it("formats as expected", function() {
            // special cases
            assert.equal(fourDecimalFormatter(-9999), "-");
            assert.equal(fourDecimalFormatter(Infinity), "-");
            assert.equal(fourDecimalFormatter(0), "0");

            // normal range
            assert.equal(fourDecimalFormatter(99.9999), "99.9999");
            assert.equal(fourDecimalFormatter(10.23456), "10.2346");
            assert.equal(fourDecimalFormatter(1.23456), "1.2346");
            assert.equal(fourDecimalFormatter(0.23456), "0.2346");
            assert.equal(fourDecimalFormatter(-0.23456), "-0.2346");
            assert.equal(fourDecimalFormatter(-10.23456), "-10.2346");

            // big numbers (boundary)
            assert.equal(fourDecimalFormatter(99.99996), "100.0000");
            assert.equal(fourDecimalFormatter(100), "100");

            // small numbers
            assert.equal(fourDecimalFormatter(0.01), "0.0100");
            assert.equal(fourDecimalFormatter(0.001), "0.0010");
            assert.equal(fourDecimalFormatter(0.0001), "0.0001");
            assert.equal(fourDecimalFormatter(0.000099999), "<0.0001");
            assert.equal(fourDecimalFormatter(0.00001), "<0.0001");
            assert.equal(fourDecimalFormatter(1e-8), "<0.0001");
        });
    });
});
