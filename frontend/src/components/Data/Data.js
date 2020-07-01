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
            <div className="data">
                <div className="row data-row">
                    <div className="col col-lg-3 inputbuttons">
                        <InputButtons />
                    </div>
                    <div className="col">{dataStore.getDataLength ? <InputFormList /> : null}</div>
                    <div className="col scatterplot">
                        {dataStore.getDataLength ? <DatasetScatterplot /> : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Data;
