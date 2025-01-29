import SingleHeader from "./SingleHeader";
import WorkSheetForm from "./WorkSheetForm";
import WorkSheetTable from "./WorkSheetTable";

export default function WorkSheet() {
  return (
    <div>
      <div className="pb-2 sm:pb-1 md:pb-2 lg:pb-3">
        <SingleHeader heading="My WorkSheet" />
      </div>
      <WorkSheetForm />
      <WorkSheetTable />
    </div>
  );
}
