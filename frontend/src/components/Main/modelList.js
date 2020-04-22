import React from "react";
const ModelList = props => {
    return props.models.map((val, idx) => {
        let FrequentistRestricted = `FrequentistRestricted-${idx}`,
            FrequentistUnRestricted = `FrequentistUnRestricted-${idx}`,
            Bayesian = `Bayesian-${idx}`,
            BayesianModelAverage = `BayesianModelAverage-${idx}`;
        return (
            <tr key={val.index}>
                <td>
                    <input
                        type="checkbox"
                        name="FrequentistRestricted"
                        value="Exponential"
                        id={FrequentistRestricted}
                        data-id={idx}
                        className="form-control "
                        onClick={e => this.handleCheckbox(e)}
                    />
                </td>
                <td>
                    <input
                        type="chekbox"
                        name="FrequentistUnRestricted"
                        value="Exponential"
                        id={FrequentistUnRestricted}
                        data-id={idx}
                        className="form-control "
                        onClick={e => this.handleCheckbox(e)}
                    />
                </td>
                <td>
                    <input
                        type="checkbox"
                        name="Bayesian"
                        value="Exponential"
                        id={Bayesian}
                        data-id={idx}
                        className="form-control "
                        onClick={e => this.handleCheckbox(e)}
                    />
                </td>
                <td>
                    <input
                        type="text"
                        name="BayesianModelAverage"
                        value="Exponential"
                        id={BayesianModelAverage}
                        data-id={idx}
                        className="form-control "
                        onClick={e => this.handleCheckbox(e)}
                    />
                </td>
            </tr>
        );
    });
};
export default ModelList;
