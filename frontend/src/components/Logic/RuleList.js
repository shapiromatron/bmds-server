import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import PropTypes from "prop-types";
import {toJS} from "mobx";
import Rule from "./Rule";

@inject("logicStore")
@observer
class RuleList extends Component {
    render() {
        const {logicStore} = this.props;
        let rules = toJS(logicStore.logic.rules);

        return (
            <div className=" row">
                <div className="col col-sm-8">
                    <table className="table table-bordered table-sm model-recommend">
                        <thead className="table-primary">
                            <tr>
                                <th colSpan="7" className="text-center">
                                    Model Recommendation/Bin Placement Logic
                                </th>
                            </tr>
                            <tr>
                                {logicStore.getModelRecommendationHeaders.map((item, i) => {
                                    return (
                                        <th key={i} className="text-center">
                                            {item}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <Rule
                            rules={rules}
                            toggleTest={e => logicStore.toggleTest(e)}
                            changeThreshold={e => logicStore.changeThreshold(e)}
                            changeBinType={e => logicStore.changeBinType(e)}
                            disableList={logicStore.getDisableList}
                            long_name={logicStore.getLongName}
                        />
                    </table>
                </div>
            </div>
        );
    }
}

RuleList.propTypes = {
    logicStore: PropTypes.object,
    getModelRecommendationHeaders: PropTypes.func,
    getModelRecommendationList: PropTypes.func,
    toggleTest: PropTypes.func,
};

export default RuleList;
