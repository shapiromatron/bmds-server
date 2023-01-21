import _ from "lodash";
import React, {Component} from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

import TextInput from "../components/common/TextInput";
import TextAreaInput from "../components/common/TextAreaInput";
import FloatInput from "../components/common/FloatInput";
import Button from "../components/common/Button";

@inject("store")
@observer
class InputForm extends Component {
    render() {
        const {settings, updateSettings, error, submit} = this.props.store;
        return (
            <form>
                <div className="row">
                    <div className="col-lg-4">
                        <TextAreaInput
                            label="Dataset"
                            value={settings.dataset}
                            onChange={value => updateSettings("dataset", value)}
                        />
                    </div>
                    <div className="col-lg-4">
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
                    <div className="col-lg-4">
                        <Button className="btn btn-primary" onClick={submit} text="Execute" />
                        {error ? (
                            <div className="alert alert-danger">An error occurred.</div>
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
class OutputTabs extends Component {
    render() {
        const {df, df2} = this.props.store.outputs;
        return (
            <Tabs defaultActiveKey="summary" className="mb-3">
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
                    <p>TODO - summary plot</p>
                </Tab>
                <Tab eventKey="plots" title="Plots">
                    <p>TODO - duration plot</p>
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
                <h2>Poly 3 adjustment</h2>
                <p className="text-muted">TODO...</p>
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
                {columns.map((column, i) => (
                    <th key={i}>{column}</th>
                ))}
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
