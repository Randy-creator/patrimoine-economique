import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./components/Header";
import Patrimoine from "./components/Patrimoine";
import PossessionList from "./components/PossessionList";
import PossessionsTable from "./PossessionsTable";
import "bootstrap/dist/css/bootstrap.min.css";

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/patrimoine",
    element: <Patrimoine />,
  },
  {
    path: "/possession",
    element: <PossessionsTable />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={route} />
  </React.StrictMode>,
);
