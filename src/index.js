import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

//import Choice from "./Choice.tsx";

import App from "./App.tsx";
import Play from "./Play.tsx";
import reportWebVitals from "./reportWebVitals";
import Importer from "./Importer.tsx";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyC2AtSZYr6BB46RVEIuXYGgjdPRdhlJHkI",
  authDomain: "twine-test-2c860.firebaseapp.com",
  projectId: "twine-test-2c860",
  storageBucket: "twine-test-2c860.appspot.com",
  messagingSenderId: "1026860393304",
  appId: "1:1026860393304:web:0044ecfdd1be758a577b2d",
  measurementId: "G-Y2K2P9NMDM",
};

window.app = initializeApp(firebaseConfig);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="import" element={<Importer />} />
      <Route path="play/:twine" element={<Play />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
//<Choice passages={twine.passages} />
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
