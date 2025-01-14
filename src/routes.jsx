import { createBrowserRouter } from "react-router-dom";
import Root from "./Layout/Root";
import Home from "./Layout/Home";
import Login from "./components/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
