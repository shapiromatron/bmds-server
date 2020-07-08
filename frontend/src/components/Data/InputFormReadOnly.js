import React from "react";

const InputFormReadOnly = props => {
    return (
        <div>
            <div className="label">
                <label style={{marginRight: "20px"}}>Dataset Name:</label>
                {props.currentDataset.dataset_name}
            </div>
            <div className="table-responsive-sm inputformreadonly">
                <table className="table table-bordered table-stripped table-hover table-sm">
                    <thead className="table-primary">
                        <tr>
                            {props.labels.map((item, index) => {
                                return [<th key={index}>{item}</th>];
                            })}
                        </tr>
                        <tr>
                            {Object.keys(props.currentDataset.column_names).map((item, i) => {
                                return [<td key={i}>{props.currentDataset.column_names[item]}</td>];
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {props.datasets.map((row, i) => {
                            return [
                                <tr key={i}>
                                    {Object.keys(row).map((key, index) => {
                                        return [<td key={index}>{row[key]}</td>];
                                    })}
                                </tr>,
                            ];
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default InputFormReadOnly;

