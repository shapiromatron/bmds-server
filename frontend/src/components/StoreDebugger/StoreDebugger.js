import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Collapse} from "react-bootstrap";
import {toJS} from "mobx";

@inject("DataStore")
@observer
class StoreDebugger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
            configData: toJS(this.props.DataStore.config),
        };
    }

    render() {
        const {isOpen} = this.state,
            setOpen = isOpen => this.setState({isOpen});

        return (
            <div style={{backgroundColor: "#efefef"}}>
                <Button className="btn btn-danger pull-right" onClick={() => setOpen(!isOpen)}>
                    {isOpen ? "Collapse" : "Expand"}&nbsp;debugger
                </Button>
                <Collapse in={isOpen}>
                    <div id="example-collapse-text">
                        <h3>Config:</h3>
                        <pre>{JSON.stringify(this.props.DataStore.config, undefined, 2)}</pre>
                        <h3>Datasets:</h3>
                        <pre>{JSON.stringify(this.props.DataStore.datasets, undefined, 2)}</pre>
                        <h3>MOdels:</h3>
                        <pre>
                            {JSON.stringify(this.props.DataStore.getModelTypes, undefined, 2)}
                        </pre>
                        <h3>Options:</h3>
                        <pre>{JSON.stringify(this.props.DataStore.options, undefined, 2)}</pre>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default StoreDebugger;
