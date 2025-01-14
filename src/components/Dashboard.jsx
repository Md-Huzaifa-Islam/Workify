import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>
      <Link to={"/dashboard/worksheet"}>Work sheet</Link>
      <Link to={"/dashboard/paymenthistory"}>Payment History</Link>
    </div>
  );
}
