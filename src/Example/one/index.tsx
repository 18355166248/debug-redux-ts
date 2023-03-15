import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import reportWebVitals from "../../reportWebVitals";

function Test() {
  console.log("test");
  return null;
}

const container = document.getElementById("root")!;
const root = createRoot(container);
console.log(222, store);
// 从这可以看出 render 初始化会执行两次
root.render(
  <React.StrictMode>
    <Test />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
