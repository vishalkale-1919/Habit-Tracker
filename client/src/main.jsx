import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HabitProvider } from "./context/HabitContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HabitProvider>
      <App />
    </HabitProvider>
  </React.StrictMode>
);
