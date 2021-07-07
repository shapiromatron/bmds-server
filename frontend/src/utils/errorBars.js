import _ from "lodash";

export const inv_tdist_05 = function(df) {
        // Calculates the inverse t-distribution using a piecewise linear form for
        // the degrees of freedom specified. Assumes a two-tailed distribution with
        // an alpha of 0.05. Based on curve-fitting using Excel's T.INV.2T function
        // with a maximum absolute error of 0.00924 and percent error of 0.33%.
        //
        // Roughly equivalent to scipy.stats.t.ppf(0.975, df)
        var b;
        if (df < 1) {
            return NaN;
        } else if (df == 1) {
            return 12.7062047361747;
        } else if (df < 12) {
            b = [
                7.9703237683e-5,
                -3.5145890027e-3,
                0.063259191874,
                -0.5963723075,
                3.129413441,
                -8.8538894383,
                13.358101926,
            ];
        } else if (df < 62) {
            b = [
                1.1184055716e-10,
                -2.7885328039e-8,
                2.8618499662e-6,
                -1.5585120701e-4,
                4.8300645273e-3,
                -0.084316656676,
                2.7109288893,
            ];
        } else {
            b = [
                5.1474329765e-16,
                -7.262226388e-13,
                4.2142967681e-10,
                -1.2973354626e-7,
                2.275308052e-5,
                -2.2594979441e-3,
                2.0766977669,
            ];
            if (df > 350) {
                console.warn("Extrapolating beyond inv_tdist_05 regression range (N>350).");
                return undefined;
            }
        }
        return (
            b[0] * Math.pow(df, 6) +
            b[1] * Math.pow(df, 5) +
            b[2] * Math.pow(df, 4) +
            b[3] * Math.pow(df, 3) +
            b[4] * Math.pow(df, 2) +
            b[5] * Math.pow(df, 1) +
            b[6]
        );
    },
    continuousErrorBars = function(dataset) {
        // Calculate 95% confidence intervals
        let uppers = [],
            lowers = [],
            bounds = [];
        dataset.doses.map((dose, idx) => {
            let n = dataset.ns[idx],
                stdev = dataset.stdevs[idx];

            if (_.isFinite(n) && _.isFinite(stdev)) {
                const se = stdev / Math.sqrt(n),
                    z = inv_tdist_05(n - 1) || 1.96,
                    change = se * z;
                uppers.push(change);
                lowers.push(change);
                bounds.push([dataset.means[idx] - change, dataset.means[idx] + change]);
            } else {
                uppers.push(undefined);
                lowers.push(undefined);
                bounds.push([undefined, undefined]);
            }
        });

        return {
            type: "data",
            symmetric: false,
            array: uppers,
            arrayminus: lowers,
            bounds,
        };
    },
    dichotomousErrorBars = function(dataset) {
        /*
        Procedure adds confidence intervals to dichotomous datasets.
        Taken from BMDS v2601.pdf, pg 142,
        https://19january2017snapshot.epa.gov/sites/production/files/2015-11/documents/bmds_manual.pdf

        LL = {(2np + z2 - 1) - z*sqrt[z2 - (2+1/n) + 4p(nq+1)]}/[2*(n+z2)]
        UL = {(2np + z2 + 1) + z*sqrt[z2 + (2-1/n) + 4p(nq-1)]}/[2*(n+z2)]

        - p = the observed proportion
        - n = the total number in the group in question
        - z = Z(1-alpha/2) is the inverse standard normal cumulative distribution
                function evaluated at 1-alpha/2
        - q = 1-p.

        The error bars shown in BMDS plots use alpha = 0.05 and so represent
        the 95% confidence intervals on the observed proportions (independent of
        model).

        Z value derivation:

        ```python
        alpha = 0.05
        z = scipy.stats.norm.ppf(1-alpha/2)
        assert numpy.isclose(scipy.stats.norm.cdf(scipy.stats.norm.ppf(alpha)), alpha)
        ```
        */
        let uppers = [],
            lowers = [],
            bounds = [];
        dataset.doses.map((dose, idx) => {
            let n = dataset.ns[idx],
                incidence = dataset.incidences[idx];

            if (_.isNumber(n) && _.isNumber(incidence) && n > 0 && n >= incidence) {
                var p = incidence / n,
                    q = 1 - p,
                    z = 1.959963984540054,
                    lower =
                        (2 * n * p +
                            2 * z -
                            1 -
                            z * Math.sqrt(2 * z - (2 + 1 / n) + 4 * p * (n * q + 1))) /
                        (2 * (n + 2 * z)),
                    upper =
                        (2 * n * p +
                            2 * z +
                            1 +
                            z * Math.sqrt(2 * z + (2 + 1 / n) + 4 * p * (n * q - 1))) /
                        (2 * (n + 2 * z));
                uppers.push(p + upper > 1 ? 1 - p : upper);
                lowers.push(lower);
                bounds.push([Math.max(p - lower, 0), Math.min(p + upper, 1)]);
            } else {
                uppers.push(undefined);
                lowers.push(undefined);
                bounds.push([undefined, undefined]);
            }
        });

        return {
            type: "data",
            symmetric: false,
            array: uppers,
            arrayminus: lowers,
            bounds,
        };
    };
