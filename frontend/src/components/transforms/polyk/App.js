import _ from "lodash";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Plot from "react-plotly.js";

import Button from "../../common/Button";
import FloatInput from "../../common/FloatInput";
import TextAreaInput from "../../common/TextAreaInput";
import TextInput from "../../common/TextInput";

@inject("store")
@observer
class InputForm extends Component {
    render() {
        const {settings, updateSettings, error, submit, loadExampleData} = this.props.store;
        return (
            <form>
                <div className="row">
                    <div className="col-lg-6">
                        <TextInput
                            label="Dose units"
                            value={settings.dose_units}
                            onChange={value => updateSettings("dose_units", value)}
                        />
                        <FloatInput
                            label="Power"
                            value={settings.power}
                            onChange={value => updateSettings("power", value)}
                        />
                        <FloatInput
                            label="Duration"
                            value={settings.duration}
                            onChange={value => updateSettings("duration", value)}
                        />
                    </div>
                    <div className="col-lg-6">
                        <TextAreaInput
                            label="Dataset"
                            value={settings.dataset}
                            onChange={value => updateSettings("dataset", value)}
                        />
                        <p className="text-muted">
                            CSV style dataset.&nbsp;
                            <a href="#" onClick={loadExampleData}>
                                Load example.
                            </a>
                        </p>
                        <Button
                            className="btn btn-primary btn-block py-3"
                            onClick={submit}
                            text="Execute"
                        />
                        {error ? (
                            <div className="alert alert-danger mt-3">
                                <p>
                                    <b>An error occurred.</b>
                                </p>
                                <pre>{JSON.stringify(error, null, 2)}</pre>
                            </div>
                        ) : null}
                    </div>
                </div>
            </form>
        );
    }
}
InputForm.propTypes = {
    store: PropTypes.object,
};

@inject("store")
@observer
class SummaryPlot extends Component {
    render() {
        const {df2} = this.props.store.outputs,
            {dose_units} = this.props.store.settings;
        return (
            <Plot
                data={[
                    {
                        x: df2.dose,
                        y: df2.proportion,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: {color: "blue"},
                        name: "Original Proportion",
                    },
                    {
                        x: df2.dose,
                        y: df2.adj_proportion,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: {color: "red"},
                        name: "Adjusted Proportion",
                    },
                ]}
                layout={{
                    height: 400,
                    title: "Adjusted Proportion vs Original Proportion",
                    legend: {
                        x: 0.03,
                        y: 1,
                    },
                    xaxis: {
                        title: {
                            text: `Dose (${dose_units})`,
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Proportion (%)",
                        },
                    },
                }}
                style={{width: "100%"}}
                useResizeHandler={true}
            />
        );
    }
}
SummaryPlot.propTypes = {
    store: PropTypes.object,
};

@inject("store")
@observer
class RawDataPlot extends Component {
    getData(df) {
        const d1 = _.zip(df.dose, df.day, df.has_tumor),
            d2 = _.groupBy(d1, arr => arr[0]);
        let results = [];
        _.each(d2, (values, key) => {
            const arr1 = [],
                arr2 = [];
            let cumulative = 0;

            _.each(values, arr => {
                if (arr[2] == 1) {
                    cumulative += 1;
                }
                arr1.push(arr[1]);
                arr2.push(cumulative);
            });
            results.push([key, arr1, arr2]);
        });
        return _.sortBy(results, arr => arr[0]);
    }
    render() {
        const {df} = this.props.store.outputs,
            data = this.getData(df),
            {dose_units} = this.props.store.settings;
        return (
            <Plot
                data={data.map(row => {
                    return {
                        x: row[1],
                        y: row[2],
                        name: `${row[0]} ${dose_units}`,
                        type: "scatter",
                        mode: "lines+markers",
                    };
                })}
                layout={{
                    height: 400,
                    title: "Tumor incidence over study duration",
                    legend: {
                        x: 0.03,
                        y: 1,
                    },
                    xaxis: {
                        title: {
                            text: "Study duration (days)",
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Cumulative tumor incidence",
                        },
                    },
                }}
                style={{width: "100%"}}
                useResizeHandler={true}
            />
        );
    }
}
RawDataPlot.propTypes = {
    store: PropTypes.object,
};

@inject("store")
@observer
class OutputTabs extends Component {
    render() {
        const {df, df2} = this.props.store.outputs;
        return (
            <Tabs
                defaultActiveKey="summary"
                className="mb-3"
                onSelect={() => {
                    // trigger resize event for plots
                    window.dispatchEvent(new Event("resize"));
                }}>
                <Tab eventKey="summary" title="Summary">
                    <DataFrameTable
                        data={df2}
                        columns={[
                            "dose",
                            "n",
                            "adj_n",
                            "incidence",
                            "proportion",
                            "adj_proportion",
                        ]}
                    />
                    <SummaryPlot />
                </Tab>
                <Tab eventKey="plots" title="Plots">
                    <RawDataPlot />
                </Tab>
                <Tab eventKey="table" title="Table">
                    <DataFrameTable
                        data={df2}
                        columns={[
                            "dose",
                            "n",
                            "adj_n",
                            "incidence",
                            "proportion",
                            "adj_proportion",
                        ]}
                    />
                </Tab>
                <Tab eventKey="data" title="Data">
                    <DataFrameTable data={df} columns={["dose", "day", "has_tumor", "adj_n"]} />
                </Tab>
            </Tabs>
        );
    }
}
OutputTabs.propTypes = {
    store: PropTypes.object,
};

@inject("store")
@observer
class App extends Component {
    render() {
        const {outputs} = this.props.store;
        return (
            <div className="container-fluid py-3">
                <h2>Poly K adjustment</h2>
                <p className="text-muted">
                    This is a work in progress. Prior to deployment, we should update the help text,
                    user-interface, instructions etc.
                </p>
                <h3>Settings</h3>
                <InputForm />
                {outputs ? (
                    <>
                        <h3>Results</h3>
                        <OutputTabs />
                    </>
                ) : null}
            </div>
        );
    }
}
App.propTypes = {
    store: PropTypes.object,
};

const DataFrameTable = function({data, columns}) {
    const nrows = data[columns[0]].length;
    return (
        <table className="table table-sm table-striped table-hover">
            <thead>
                <tr>
                    {columns.map((column, i) => (
                        <th key={i}>{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {_.range(nrows).map(i => {
                    return (
                        <tr key={i}>
                            {columns.map((column, j) => (
                                <td key={j}>{data[column][i]}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};
DataFrameTable.propTypes = {
    data: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.string.isRequired),
};

export default App;
