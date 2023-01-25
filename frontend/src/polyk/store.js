import {action, observable} from "mobx";

import {getHeaders} from "../common";
import {exampleData} from "./data";

class Store {
    constructor(token) {
        this.token = token;
    }

    @observable settings = {
        dataset: "",
        dose_units: "ppm",
        power: 3,
        duration: 730,
    };
    @observable error = null;
    @observable outputs = null;

    @action.bound
    updateSettings(key, value) {
        this.settings[key] = value;
    }

    @action.bound
    async submit() {
        const url = "/api/v1/polyk/";
        this.error = null;
        await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: getHeaders(this.token),
            body: JSON.stringify(this.settings),
        })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        this.outputs = data;
                    });
                } else {
                    response
                        .json()
                        .then(data => {
                            this.error = data;
                            console.error(data);
                        })
                        .catch(error => {
                            this.error = true;
                            console.error(error);
                        });
                }
            })
            .catch(error => {
                this.error = true;
                console.error(error);
            });
    }

    @action.bound
    loadExampleData() {
        this.updateSettings("dataset", exampleData);
    }
}

export default Store;
