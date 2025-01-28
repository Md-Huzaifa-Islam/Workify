import { useState } from "react";
import AllEmployeeTable from "./AllEmployeeTable";
import { FaTableList } from "react-icons/fa6";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import AllEmployeeCard from "./AllEmployeeCard";

export default function AllEmployeeList() {
  const [table, setTable] = useState(true);
  return (
    <div>
      {/* toggle container */}
      <div className="flex gap-2 px-4 text-2xl">
        <button
          className="rounded-md border-2 p-2"
          onClick={() => {
            setTable(true);
            console.log(table);
          }}
        >
          <FaTableList />
        </button>
        <button
          className="rounded-md border-2 p-2"
          onClick={() => setTable(false)}
        >
          <TfiLayoutGrid2Alt />
        </button>
        {/* <button onClick={() => setTable((p) => !p)}>Change layout</button> */}
      </div>
      {table && <AllEmployeeTable />}
      {table || <AllEmployeeCard />}
    </div>
  );
}
