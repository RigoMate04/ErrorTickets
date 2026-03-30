import React, { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.jsx";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App></App>
  </StrictMode>
);
