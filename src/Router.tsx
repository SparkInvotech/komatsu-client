import { createHashRouter } from "react-router-dom";

import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

// createBrowserRouter
export const router = createHashRouter([
  {
    path: "/",
    element: <Applayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "auth/login",
        element: <Login />,
      },
      {
        path: "auth/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "*",
    element: <NoMatch />,
  },
]);
