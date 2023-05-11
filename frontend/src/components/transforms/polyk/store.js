import { action, observable } from "mobx";

import { getHeaders } from "../../../common";
import { exampleData } from "./data";

class Store {
    constructor(token) {
        this.token = token;
    }

    @observable settings = {
        dataset: "",
        dose_units: "ppm",
        power: 3,
        duration: null,
    };
    @observable error = null;
    @observable errorObject = null;
    @observable outputs = null;

    @observable showAbout = false;
    @action.bound
    setAboutModal(input) {
        this.showAbout = input;
    }

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
                            this.error = true;
                            console.error(data);
                            try {
                                this.error = JSON.parse(data);
                            } catch (err) {
                                console.error(err);
                            }
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
