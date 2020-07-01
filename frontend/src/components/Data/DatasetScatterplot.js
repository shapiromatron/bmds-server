import React, {Component} from "react";

import {inject, observer} from "mobx-react";

@inject("store")
@observer
class DatasetScatterplot extends Component {
    render() {
        return <div>Scatter Plot</div>;
    }
}

export default DatasetScatterplot;
