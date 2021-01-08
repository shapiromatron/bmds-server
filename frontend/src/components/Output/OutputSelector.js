import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";

@inject("outputStore")
@observer
class OutputSelector extends Component {
    render() {
        const store = this.props.outputStore;
        return (
            <div className="nav flex-column nav-fill nav-pills nav-stacked mt-2">
                {store.outputs.map((output, idx) => {
                    return (
                        <a
                            key={idx}
                            className={
                                idx === store.selectedOutputIndex
                                    ? "nav-link btn-sm active"
                                    : "nav-link btn-sm"
                            }
                            data-toggle="pill"
                            href="#"
                            role="tab"
                            aria-selected="true"
                            onClick={e => {
                                e.preventDefault();
                                store.setSelectedOutputIndex(idx);
                            }}>
                            {store.getOutputName(idx)}
                        </a>
                    );
                })}
            </div>
        );
    }
}
OutputSelector.propTypes = {
    outputStore: PropTypes.object,
};
export default OutputSelector;
