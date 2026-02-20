import { createRoot } from "react-dom/client";
import App from "./App";
import "./main.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import React from "react";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
