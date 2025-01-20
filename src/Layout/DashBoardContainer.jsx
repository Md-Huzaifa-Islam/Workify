import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/CustomHooks";

export default function DashBoardContainer() {
  const { role } = useAuth();
  return (
    <div className="flex px-5 md:container md:mx-auto">
      <div className="flex flex-col gap-4 bg-blue-600 px-5 py-8 text-white">
        <Link to={"/dashboard"}>My Profile</Link>
        {role == "Employee" && (
          <Link to={"/dashboard/worksheet"}>My Work sheet</Link>
        )}
        {role == "Employee" && (
          <Link to={"/dashboard/paymenthistory"}>Payment History</Link>
        )}
        {role == "HR" && (
          <Link to={"/dashboard/employeelist"}>Employee List</Link>
        )}
        {role == "HR" && <Link to={"/dashboard/progress"}>Progress</Link>}
        {role == "Admin" && (
          <Link to={"/dashboard/allemployeelist"}>All employees</Link>
        )}
        {role == "Admin" && (
          <Link to={"/dashboard/payrolls"}>All payrolls</Link>
        )}
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}
