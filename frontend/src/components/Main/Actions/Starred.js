import _ from "lodash";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import React, {Component} from "react";

import Button from "../../common/Button";

@inject("mainStore")
@observer
class Starred extends Component {
    render() {
        const {mainStore} = this.props,
            {starred} = mainStore,
            icon = starred ? "star-fill" : "star",
            title = starred ? "Remove star" : "Add star";
        if (!mainStore.canEdit || !mainStore.isDesktop) {
            return null;
        }

        return (
            <li className="nav-item mr-1">
                {
                    <Button
                        className="btn starred"
                        onClick={mainStore.starToggle}
                        icon={icon}
                        title={title}
                        label="Star"
                    />
                }
            </li>
        );
    }
}
Starred.propTypes = {
    mainStore: PropTypes.object,
};
export default Starred;
