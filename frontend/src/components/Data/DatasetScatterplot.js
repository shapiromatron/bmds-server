import React, {Component} from "react";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class DatasetScatterplot extends Component {
    render() {
        return <div className="col col-sm-4">Scatter Plot</div>;
    }
}

export default DatasetScatterplot;
