import React, {Component} from "react";

class RunAnalysisService extends Component {
    constructor(props) {
        super(props);
    }

    async runJob(data) {
        let url = "/api/v1/job/0295736b-7217-4e5f-bf10-cc23f7c5451a/patch-inputs/";
        return fetch(url, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                console.log("response is", response);

                // return response.json();
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return <div></div>;
    }
}

export default RunAnalysisService;
