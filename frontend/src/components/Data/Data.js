import React, {Component} from "react";
import InputFormList from "./InputFormList";
import InputButtons from "./InputButtons";
import "./Data.css";
import {inject, observer} from "mobx-react";
import DatasetScatterplot from "./DatasetScatterplot";

@inject("dataStore")
@observer
class Data extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="container data">
                <div className="row">
                    <InputButtons />
                    {dataStore.getDataLength ? <InputFormList /> : null}

                    {dataStore.getDataLength ? <DatasetScatterplot /> : null}
                </div>
            </div>
        );
    }
}

export default Data;
