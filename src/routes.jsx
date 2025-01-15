import { createBrowserRouter } from "react-router-dom";
import Root from "./Layout/Root";
import Home from "./Layout/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import PrivateRoute from "./Providers/PrivateRoute";
import WorkSheet from "./components/WorkSheet";
import DashBoardContainer from "./Layout/DashBoardContainer";
import PaymentHistory from "./components/PaymentHistory";
import EmployeeList from "./components/EmployeeList";
import AllEmployeeList from "./components/AllEmployeeList";
// import PrivateRoute from "./components/Dashboard";

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
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashBoardContainer />
          </PrivateRoute>
        ),

        children: [
          {
            path: "",
            element: <Dashboard />,
          },
          {
            path: "worksheet",
            element: <WorkSheet />,
          },
          {
            path: "paymenthistory",
            element: <PaymentHistory />,
          },
          {
            path: "employeelist",
            element: <EmployeeList />,
          },
          {
            path: "allemployeelist",
            element: <AllEmployeeList />,
          },
        ],
      },
    ],
  },
]);
