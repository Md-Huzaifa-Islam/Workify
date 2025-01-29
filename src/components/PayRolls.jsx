import PayRollsTable from "./PayRollsTable";
import PayRollsTable2 from "./PayRollsTable2";
import SingleHeader from "./SingleHeader";

export default function PayRolls() {
  return (
    <div>
      <SingleHeader heading="All payrolls" />
      <div className="hidden sm:block">
        <PayRollsTable />
      </div>
      <div className="sm:hidden">
        <PayRollsTable2 />
      </div>
    </div>
  );
}
