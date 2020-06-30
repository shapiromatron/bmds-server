import React, {Component} from "react";
import {inject, observer} from "mobx-react";
import {Button, Collapse} from "react-bootstrap";

@inject("store")
@observer
class StoreDebugger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: true,
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
                        <pre>{JSON.stringify(this.props.store.mainStore.config, undefined, 2)}</pre>
                        <h3>Datasets:</h3>
                        <pre>
                            {JSON.stringify(this.props.store.dataStore.datasets, undefined, 2)}
                        </pre>
                        <h3>Options:</h3>
                        <pre>
                            {JSON.stringify(this.props.store.mainStore.options, undefined, 2)}
                        </pre>
                        <h3>Models:</h3>
                        <pre>{JSON.stringify(this.props.store.mainStore.models, undefined, 2)}</pre>
                    </div>
                </Collapse>
            </div>
        );
    }
}

export default StoreDebugger;
