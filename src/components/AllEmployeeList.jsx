import { useState } from "react";
import AllEmployeeTable from "./AllEmployeeTable";
import { FaTableList } from "react-icons/fa6";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import AllEmployeeCard from "./AllEmployeeCard";
import SingleHeader from "./SingleHeader";
import AllEmployeeTable2 from "./AllEmployeeTable2";

export default function AllEmployeeList() {
  const [table, setTable] = useState(true);
  return (
    <div>
      <SingleHeader heading="All employee list" />
      {/* toggle container */}
      <p className="px-4 pb-3 text-right text-lg font-semibold">
        {" "}
        Change Layout
      </p>
      <div className="flex items-center justify-end gap-2 px-4 text-2xl">
        <button
          className={`rounded-md border-2 p-2 ${table && "text-blue-600"}`}
          onClick={() => {
            setTable(true);
          }}
        >
          <FaTableList />
        </button>
        <button
          className={`rounded-md border-2 p-2 ${table || "text-blue-600"}`}
          onClick={() => setTable(false)}
        >
          <TfiLayoutGrid2Alt />
        </button>
        {/* <button onClick={() => setTable((p) => !p)}>Change layout</button> */}
      </div>

      {table && (
        <div>
          <div className="hidden sm:block">
            <AllEmployeeTable />
          </div>

          <div className="sm:hidden">
            <AllEmployeeTable2 />
          </div>
        </div>
      )}

      {table || <AllEmployeeCard />}
    </div>
  );
}
