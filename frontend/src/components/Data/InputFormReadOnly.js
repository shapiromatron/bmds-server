import React from "react";

const InputFormReadOnly = props => {
    return (
        <div>
            <div>
                <label style={{marginRight: "20px"}}>Dataset Name:</label>
                {props.currentDataset.dataset_name}
            </div>
            <div className="table-responsive-sm inputformreadonly">
                <table className="table table-bordered table-stripped table-hover table-sm">
                    <thead className="table-primary">
                        <tr>
                            {Object.keys(props.datasets[0]).map((item, index) => {
                                return [<th key={index}>{item}</th>];
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {props.datasets.map((row, i) => {
                            return [
                                <tr key={i}>
                                    {Object.keys(row).map((key, index) => {
                                        return [
                                            <td key={index}>
                                                <p>{row[key]}</p>
                                            </td>,
                                        ];
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
