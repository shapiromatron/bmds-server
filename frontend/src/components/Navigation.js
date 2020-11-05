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
        const {excelUrl, wordUrl} = this.props.mainStore.config;
        return (
            <div style={{marginTop: "1em"}}>
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">
                            Settings
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/data">
                            Data
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/output">
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
                                <a className="dropdown-item" href={excelUrl}>
                                    <i className="fa fa-file-excel-o"></i>&nbsp;Download dataset
                                </a>
                                <a className="dropdown-item" href={wordUrl}>
                                    <i className="fa fa-file-word-o"></i>&nbsp;Download report
                                </a>
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
            </div>
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
