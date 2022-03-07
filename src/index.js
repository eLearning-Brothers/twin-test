import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import Choice from "./Choice.tsx";
import reportWebVitals from "./reportWebVitals";
import twine from "./twine";

ReactDOM.render(
  <React.StrictMode>
    <h3>{twine.name}</h3>
    <Choice passages={twine.passages} />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
