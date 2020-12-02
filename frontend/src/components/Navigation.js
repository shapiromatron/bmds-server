import React, {Component} from "react";
import {Route, NavLink} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Main from "./Main/Main";
import Data from "./Data/Data";
import Logic from "./Logic/Logic";
import Output from "./Output/Output";
import PropTypes from "prop-types";

@inject("mainStore")
@observer
class Navigation extends Component {
    render() {
        const {mainStore} = this.props,
            {config} = mainStore;
        return (
            <>
                <ul className="nav nav-tabs mt-3">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/" exact={true}>
                            Settings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/data">
                            Data
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink id="navlink-output" className="nav-link" to="/output">
                            Output
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/logic">
                            Logic
                        </NavLink>
                    </li>
                    <li className="nav-item ml-auto">
                        <div className="dropdown">
                            <button
                                className="btn btn-info dropdown-toggle"
                                type="button"
                                id="bmdSessionActions"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
                                Actions
                            </button>
                            <div
                                className="dropdown-menu dropdown-menu-right"
                                aria-labelledby="bmdSessionActions">
                                {mainStore.getEditSettings ? (
                                    <>
                                        <h6 className="dropdown-header">Edit settings</h6>
                                        <a className="dropdown-item" href="#">
                                            <label
                                                htmlFor="file"
                                                className="loadAnalysisLabel"
                                                role="button">
                                                <i className="fa fa-fw fa-upload"></i>
                                                &nbsp;Load analysis
                                                <input
                                                    type="file"
                                                    id="file"
                                                    onChange={e => {
                                                        e.stopPropagation();
                                                        mainStore.loadAnalysisFromFile(
                                                            e.target.files[0]
                                                        );
                                                    }}
                                                />
                                            </label>
                                        </a>
                                    </>
                                ) : null}
                                {mainStore.hasOutputs ? (
                                    <>
                                        <h6 className="dropdown-header">Reporting</h6>
                                        <a className="dropdown-item" href={config.excelUrl}>
                                            <i className="fa fa-fw fa-file-excel-o"></i>
                                            &nbsp;Download data
                                        </a>
                                        <a className="dropdown-item" href={config.wordUrl}>
                                            <i className="fa fa-fw fa-file-word-o"></i>
                                            &nbsp;Download report
                                        </a>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                mainStore.saveAnalysisToFile();
                                            }}>
                                            <i className="fa fa-fw fa-download"></i>
                                            &nbsp;Download analysis
                                        </a>
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="content">
                    <Route exact path="/" component={Main} />
                    <Route path="/data" component={Data} />
                    <Route path="/logic" component={Logic} />
                    <Route path="/output" component={Output} />
                </div>
                <div id="payload" style={{color: "white", height: "1px", overflow: "hidden"}}>
                    {JSON.stringify(mainStore.getPayload, undefined, 2)}
                </div>
            </>
        );
    }
}
Navigation.propTypes = {
    mainStore: PropTypes.object,
    wordUrl: PropTypes.string,
    ExcelUrl: PropTypes.string,
    config: PropTypes.object,
};
export default Navigation;
