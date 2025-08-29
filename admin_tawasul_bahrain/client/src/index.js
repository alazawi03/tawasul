import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";

// Try to import the config file, but handle if it doesn't exist
let amplifyconfig = {};
try {
  amplifyconfig = require("./amplifyconfiguration.json");
} catch (error) {
  console.log("Amplify configuration not found, using default empty config");
  amplifyconfig = {};
}

Amplify.configure(amplifyconfig);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
