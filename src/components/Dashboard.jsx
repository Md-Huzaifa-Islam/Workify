import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/CustomHooks";

export default function Dashboard() {
  const { role } = useAuth();
  return (
    <div className="flex items-center justify-between">
      {role == "Employee" && (
        <Link to={"/dashboard/worksheet"}>Work sheet</Link>
      )}
      {role == "Employee" && (
        <Link to={"/dashboard/paymenthistory"}>Payment History</Link>
      )}
      {role == "HR" && <Link to={"/dashboard/employeelist"}>employeelist</Link>}
      {role == "HR" && <Link to={"/dashboard/progress"}>Progress</Link>}
      {role == "Admin" && (
        <Link to={"/dashboard/allemployeelist"}>all employeelist</Link>
      )}
      {role == "Admin" && <Link to={"/dashboard/payrolls"}>all payrolls</Link>}
    </div>
  );
}
