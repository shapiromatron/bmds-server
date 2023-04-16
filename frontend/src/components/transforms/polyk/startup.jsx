// import { Provider } from "mobx-react";
import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import Foo from './Foo';

// import App from "./App";
// import Store from "./store";

// const render = function (el) {
//     const config = JSON.parse(document.getElementById("config").textContent),
//         root = createRoot(el),
//         store = new Store(config.token);
//     root.render(<p>Hi</p>)

//     root.render(
//         <Provider store={store}>
//             <App />
//         </Provider>
//     );
// };

class Cls extends Component {
    render() {
        return <p>Hi class?</p>
    }
}


export default (el) => {
    // https://github.com/vitejs/vite-plugin-react/issues/11#discussion_r430879201
    //React fast refresh does not work with class components, only functional components.
    // this works? maybe one component per file?!??
    const root = createRoot(el);
    root.render(<>
        <p>Hi functional #1?</p>
        <Foo />
        <Cls />
    </>);
};
