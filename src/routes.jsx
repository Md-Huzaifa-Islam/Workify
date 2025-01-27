import { createBrowserRouter } from "react-router-dom";
import Root from "./Layout/Root";
import Home from "./Layout/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./Providers/PrivateRoute";
import WorkSheet from "./components/WorkSheet";
import DashBoardContainer from "./Layout/DashBoardContainer";
import AllEmployeeList from "./components/AllEmployeeList";
import PayRolls from "./components/PayRolls";
import Progress from "./components/Progress";
import AdminRoute from "./Providers/AdminRoute";
import HrRoute from "./Providers/HrRoute";
import EmployeeRoute from "./Providers/EmployeeRoute";
import Details from "./components/Details";
import Contact from "./components/Contact";
import Profile from "./components/Profile";
import EmployeeTable from "./components/EmployeeTable";
import PaymentHistory from "./components/PaymentHistory";
import DbCheckRoute from "./Providers/DbCheckRoute";
import UpdateInfo from "./components/UpdateInfo";
import FiredPage from "./components/FiredPage";
// import PrivateRoute from "./components/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <DbCheckRoute>
            <Home />
          </DbCheckRoute>
        ),
      },
      {
        path: "/notcompleted",
        element: <UpdateInfo />,
      },
      {
        path: "/login",
        element: (
          <DbCheckRoute>
            <Login />
          </DbCheckRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <DbCheckRoute>
            <Register />
          </DbCheckRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <DbCheckRoute>
            <Contact />
          </DbCheckRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <DbCheckRoute>
            <PrivateRoute>
              <DashBoardContainer />
            </PrivateRoute>
          </DbCheckRoute>
        ),

        children: [
          {
            path: "",
            element: <Profile />,
          },
          {
            path: "worksheet",
            element: (
              <EmployeeRoute>
                <WorkSheet />
              </EmployeeRoute>
            ),
          },
          {
            path: "paymenthistory",
            element: (
              <EmployeeRoute>
                <PaymentHistory />
              </EmployeeRoute>
            ),
          },
          {
            path: "employeelist",
            element: (
              <HrRoute>
                <EmployeeTable />
              </HrRoute>
            ),
          },
          {
            path: "progress",
            element: (
              <HrRoute>
                <Progress />
              </HrRoute>
            ),
          },
          {
            path: "details/:id",
            element: (
              <HrRoute>
                <Details />
              </HrRoute>
            ),
          },
          {
            path: "allemployeelist",
            element: (
              <AdminRoute>
                <AllEmployeeList />
              </AdminRoute>
            ),
          },
          {
            path: "payrolls",
            element: (
              <AdminRoute>
                <PayRolls />
              </AdminRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/fired",
    element: <FiredPage />,
  },
]);
