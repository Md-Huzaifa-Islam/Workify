import { Link, Outlet, useLocation } from "react-router-dom";
import useAuth from "../Hooks/CustomHooks";

export default function DashBoardContainer() {
  const { role } = useAuth();
  const location = useLocation().pathname;
  return (
    <div className="mt-10 flex flex-col items-center sm:pr-5 md:flex-row md:items-start">
      <div className="mr-5 hidden h-max flex-col gap-4 rounded-r-3xl bg-blue-600 px-5 py-8 text-white md:flex">
        <p className="border-b-2 pb-2 text-2xl font-bold">{role} Panel</p>
        <Link
          className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard" && "bg-white text-blue-600"}`}
          to={"/dashboard"}
        >
          My Profile
        </Link>
        {role == "Employee" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/worksheet" && "bg-white text-blue-600"}`}
            to={"/dashboard/worksheet"}
          >
            My Work sheet
          </Link>
        )}
        {role == "Employee" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/paymenthistory" && "bg-white text-blue-600"}`}
            to={"/dashboard/paymenthistory"}
          >
            Payment History
          </Link>
        )}
        {role == "HR" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/employeelist" && "bg-white text-blue-600"}`}
            to={"/dashboard/employeelist"}
          >
            Employee List
          </Link>
        )}
        {role == "HR" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/progress" && "bg-white text-blue-600"}`}
            to={"/dashboard/progress"}
          >
            Progress
          </Link>
        )}
        {role == "Admin" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/allemployeelist" && "bg-white text-blue-600"}`}
            to={"/dashboard/allemployeelist"}
          >
            All employees
          </Link>
        )}
        {role == "Admin" && (
          <Link
            className={`rounded-full border px-2 py-1 text-center text-xl font-semibold ${location == "/dashboard/payrolls" && "bg-white text-blue-600"}`}
            to={"/dashboard/payrolls"}
          >
            All payrolls
          </Link>
        )}
      </div>
      <div className="mx-5 mb-10 flex h-max flex-col items-center gap-4 rounded-2xl bg-blue-600 px-5 py-8 text-white sm:mr-5 md:hidden">
        <p className="pb-2 text-2xl font-bold underline">{role} Panel</p>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard" && "bg-white text-blue-600"}`}
            to={"/dashboard"}
          >
            My Profile
          </Link>
          {role == "Employee" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/worksheet" && "bg-white text-blue-600"}`}
              to={"/dashboard/worksheet"}
            >
              My Work sheet
            </Link>
          )}
          {role == "Employee" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/paymenthistory" && "bg-white text-blue-600"}`}
              to={"/dashboard/paymenthistory"}
            >
              Payment History
            </Link>
          )}
          {role == "HR" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/employeelist" && "bg-white text-blue-600"}`}
              to={"/dashboard/employeelist"}
            >
              Employee List
            </Link>
          )}
          {role == "HR" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/progress" && "bg-white text-blue-600"}`}
              to={"/dashboard/progress"}
            >
              Progress
            </Link>
          )}
          {role == "Admin" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/allemployeelist" && "bg-white text-blue-600"}`}
              to={"/dashboard/allemployeelist"}
            >
              All employees
            </Link>
          )}
          {role == "Admin" && (
            <Link
              className={`whitespace-nowrap rounded-full border px-2 py-1 text-center text-lg font-semibold ${location == "/dashboard/payrolls" && "bg-white text-blue-600"}`}
              to={"/dashboard/payrolls"}
            >
              All payrolls
            </Link>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
