import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("dataStore")
@observer
class DatasetNames extends Component {
    render() {
        const {dataStore} = this.props;
        return (
            <div className="nav flex-column nav-pills nav-stacked mb-2 w-75 col-sm">
                {this.props.dataStore.datasets.map((dataset,index)=>{
                    return(
                        <a
                        key={index}
                        className={dataset.dataset_id=== dataStore.selectedDatasetIndex ? "nav-link active":"nav-link"}
                        data-toggle="pill"
                        href="#"
                        role="tab"
                        aria-selected="true"
                        onClick={()=> dataStore.setCurrentDatasetIndex(dataset.dataset_id)}>
                        {dataset.dataset_name}
                        </a>

                    )
                })}
            </div>
        );
    }
}
DatasetNames.propTypes = {
    dataStore: PropTypes.object,
    datasets: PropTypes.array,
    setCurrentDatasetIndex: PropTypes.func,
    getEditSettings: PropTypes.func,
};
export default DatasetNames;
