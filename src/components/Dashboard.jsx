import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <Link to={"/dashboard/worksheet"}>Work sheet</Link>
      <Link to={"/dashboard/paymenthistory"}>Payment History</Link>
      <Link to={"/dashboard/employeelist"}>employeelist</Link>
      <Link to={"/dashboard/progress"}>Progress</Link>
      <Link to={"/dashboard/allemployeelist"}>all employeelist</Link>
      <Link to={"/dashboard/payrolls"}>all payrolls</Link>
    </div>
  );
}
