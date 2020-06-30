import React from "react";
import CSGoodnessFit from "./CSGoodnessFit";
import DGoodnessFit from "./DGoodnessFit";

const GoodnessFit = props => {
    return (
        <table className="table table-bordered">
            <thead className="table-primary">
                <tr>
                    <th colSpan="9">Goodness of Fit</th>
                </tr>
                <tr>
                    {props.headers.map((header, i) => {
                        return [<th key={i}>{header}</th>];
                    })}
                </tr>
            </thead>
            {props.model_type == "CS" ? <CSGoodnessFit goodnessfit={props.goodnessFit} /> : null}
            {props.model_type == "D" ? <DGoodnessFit goodnessfit={props.goodnessFit} /> : null}
        </table>
    );
};

export default GoodnessFit;
