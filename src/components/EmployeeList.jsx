import { Helmet } from "react-helmet-async";
import EmployeeTable from "./EmployeeTable";

export default function EmployeeList() {
  return (
    <div>
      <Helmet>
        <title>EmployList || Workify</title>
      </Helmet>

      <div className="">
        <EmployeeTable />
      </div>
    </div>
  );
}
