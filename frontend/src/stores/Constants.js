export const generateLine = {
    "Exponential": (doses, param) => {
        return doses.map((dose) => {
            return param.g + (param.v * Math.pow(dose, param.n)) /
                (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
        })
    },
    "Hill": (doses, param) => {
        return doses.map((dose) => {
            return param.g + (param.v * Math.pow(dose, param.n)) /
                (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
        })
    },
    "Linear": (doses, param) => {
        return doses.map((dose) => {
            return param.g + param.b1 * dose
        })
    },
    "Polynomial": (doses, param) => {
        return doses.map((dose) => {
            return param.g + (param.v * Math.pow(dose, param.n)) /
                (Math.pow(param.k, param.n) + Math.pow(dose, param.n))
        })
    },
    "Power": (doses, param) => {
        return doses.map((dose) => {
            return param.g + param.v * Math.pow(dose, param.n)
        })
    },
    "Dichotomous-Hill": (doses, param) => {
        return doses.map((dose) => {
            return param.g +
                (param.v - param.v * param.g) /
                (1 + Math.exp(-param.a - param.b * Math.log(dose)))
        })
    },
    "Gamma": (doses, param) => {
        return doses.map((dose) => {
            return param.g + (1 - param.g);
        })
    },
    "Logistic": (doses, param) => {
        return doses.map((dose) => {
            return 1 / [1 + Math.exp(-param.a - param.b * dose)];
        })
    },
    "Log-Logistic": (doses, param) => {
        return doses.map((dose) => {
            return param.g +
                (1 - param.g) / [1 + Math.exp(-param.a - param.b * Math.Log(dose))];
        })
    },
    "Log-Probit": (doses, param) => {
        return doses.map((dose) => {
            return param.g +
                (1 - param.g) * Math.sqrt(param.a + param.b * Math.Log(dose));
        })
    },
    "Multistage": (doses, param) => {
        return doses.map((dose) => {
            return param.g +
                (1 - param.g) *
                [1 - Math.exp((-param.b1 * dose) ^ (1 - param.b2 * dose) ^ 2)];
        })
    },
    "Probit": (doses, param) => {
        return doses.map((dose) => {
            return Math.sqrt(param.a + param.b * dose);
        })
    },
    "Quantal Linear": (doses, param) => {
        return doses.map((dose) => {
            return param.g + (1 - param.g) * [1 - Math.exp(-param.b * dose)];
        })
    },
    "Weibull": (doses, param) => {
        return doses.map((dose) => {
            return param.g +
                (1 - param.g) * [1 - Math.exp((-param.b * dose) ^ param.a)];
        })
    },

}